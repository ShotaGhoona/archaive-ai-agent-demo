import { AgentConfig, AgentRequest, AgentResponse, AgentError } from './types';
import { calculateUsage } from './openai-client';
import OpenAI from 'openai';

export abstract class BaseAgent {
  abstract config: AgentConfig;

  // メイン処理メソッド（各エージェントで実装）
  abstract process(request: AgentRequest): Promise<AgentResponse>;

  // 共通バリデーション
  protected validateRequest(request: AgentRequest): void {
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

  // メトリクス記録（将来的な監視・分析用）
  protected recordMetrics(request: AgentRequest, response: AgentResponse, processingTime: number): void {
    // 将来的にはメトリクス収集システムに送信
    this.log('info', 'Request processed', {
      messageLength: request.message.length,
      responseLength: response.response.length,
      processingTime,
      tokensUsed: response.usage?.tokensUsed,
      cost: response.usage?.cost
    });
  }
}