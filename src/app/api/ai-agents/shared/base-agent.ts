import { AgentConfig, AgentResponse, AgentError, UnifiedAgentRequest } from './types';
import { calculateUsage, createVisionCompletion, createChatCompletion } from './openai-client';
import OpenAI from 'openai';

export abstract class BaseAgent {
  abstract config: AgentConfig;

  // 🎯 統一処理エントリーポイント（新版）
  async process(request: UnifiedAgentRequest): Promise<AgentResponse> {
    const startTime = Date.now();
    
    try {
      this.validateRequest(request);
      const systemPrompt = this.buildSystemPrompt();
      
      // 🔥 自動判定：画像があればVision API、なければChat API
      const completion = await this.processWithAutoDetection(systemPrompt, request);
      
      const content = completion.choices[0]?.message?.content;
      if (!content) throw new Error('No response content from OpenAI API');
      
      const response = this.createResponse(content, completion);
      this.recordMetrics(request, response, Date.now() - startTime);
      
      return response;
    } catch (error) {
      this.handleError(error as Error);
    }
  }

  // 🎯 各エージェントで実装する抽象メソッド
  abstract buildSystemPrompt(): string;

  // 🎯 自動判定処理
  private async processWithAutoDetection(
    systemPrompt: string, 
    request: UnifiedAgentRequest
  ) {
    const imageAttachment = request.attachments?.find(att => att.type === 'image');
    
    if (imageAttachment) {
      // 自動的にVision API使用
      return await this.processWithVision(systemPrompt, request, imageAttachment);
    } else {
      // 通常のChat API使用
      return await this.processWithText(systemPrompt, request);
    }
  }

  private async processWithVision(
    systemPrompt: string, 
    request: UnifiedAgentRequest, 
    imageAttachment: { type: 'image' | 'file' | 'audio'; data: File; mimeType: string; filename: string }
  ) {
    const bytes = await imageAttachment.data.arrayBuffer();
    const base64Image = Buffer.from(bytes).toString('base64');
    
    return await createVisionCompletion(
      systemPrompt,
      request.message,
      base64Image,
      imageAttachment.mimeType || 'image/jpeg',
      this.getCompletionOptions()
    );
  }

  private async processWithText(systemPrompt: string, request: UnifiedAgentRequest) {
    const messages = this.buildMessages(systemPrompt, request);
    return await createChatCompletion(messages, this.getCompletionOptions());
  }

  protected buildMessages(systemPrompt: string, request: UnifiedAgentRequest) {
    const messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }> = [
      { role: 'system', content: systemPrompt }
    ];

    // 会話履歴の追加
    if (request.context?.history) {
      messages.push(...request.context.history);
    }

    // 現在のメッセージ追加
    messages.push({ role: 'user', content: request.message });

    return messages;
  }

  // 🎯 エージェント固有設定（サブクラスでオーバーライド可能）
  protected getCompletionOptions() {
    return { temperature: 0.7, maxTokens: 2000 };
  }

  // 下位互換性のため保持（将来削除予定）
  // abstract process(request: AgentRequest): Promise<AgentResponse>;

  // 🎯 統一バリデーション（新版）
  protected validateRequest(request: UnifiedAgentRequest): void {
    if (!request.message || typeof request.message !== 'string') {
      throw new AgentError('Message is required and must be a string', 'INVALID_MESSAGE', 400);
    }

    if (request.message.length > 2000) {
      throw new AgentError('Message too long (max 2000 characters)', 'MESSAGE_TOO_LONG', 400);
    }
  }

  // 共通エラーハンドリング
  protected handleError(error: Error): never {
    console.error(`[${this.config.id}] Agent error:`, error);

    if (error instanceof AgentError) {
      throw error;
    }

    // OpenAI API エラーの詳細処理
    if (error.message.includes('API key')) {
      throw new AgentError(
        'OpenAI API key configuration error',
        'API_KEY_ERROR',
        500
      );
    }

    if (error.message.includes('rate limit')) {
      throw new AgentError(
        'API rate limit exceeded. Please try again later.',
        'RATE_LIMIT_EXCEEDED',
        429
      );
    }

    if (error.message.includes('content_policy')) {
      throw new AgentError(
        'Content does not comply with usage policies.',
        'CONTENT_POLICY_VIOLATION',
        400
      );
    }

    // 一般的なエラー
    throw new AgentError(
      'Internal server error',
      'INTERNAL_ERROR',
      500
    );
  }

  // レスポンス作成ヘルパー
  protected createResponse(
    content: string,
    openaiResponse?: OpenAI.Chat.Completions.ChatCompletion,
    attachments?: any[]
  ): AgentResponse {
    const usage = openaiResponse ? calculateUsage(openaiResponse) : undefined;

    return {
      response: content,
      agentId: this.config.id,
      timestamp: new Date().toISOString(),
      usage: usage ? {
        tokensUsed: usage.tokensUsed,
        cost: usage.cost,
        processingTime: Date.now() // 実際の処理時間は呼び出し元で計算
      } : undefined,
      attachments
    };
  }

  // ログ出力ヘルパー
  protected log(level: 'info' | 'warn' | 'error', message: string, data?: any): void {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${this.config.id}] ${message}`;
    
    switch (level) {
      case 'info':
        console.log(logMessage, data || '');
        break;
      case 'warn':
        console.warn(logMessage, data || '');
        break;
      case 'error':
        console.error(logMessage, data || '');
        break;
    }
  }

  // 🎯 統一メトリクス記録（新版）
  protected recordMetrics(request: UnifiedAgentRequest, response: AgentResponse, processingTime: number): void {
    // 将来的にはメトリクス収集システムに送信
    this.log('info', 'Request processed', {
      messageLength: request.message.length,
      responseLength: response.response.length,
      processingTime,
      tokensUsed: response.usage?.tokensUsed,
      cost: response.usage?.cost,
      hasImage: !!request.attachments?.some(att => att.type === 'image')
    });
  }
}