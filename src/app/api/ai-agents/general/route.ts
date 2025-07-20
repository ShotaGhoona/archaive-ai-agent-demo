import { NextRequest, NextResponse } from 'next/server';
import { BaseAgent } from '../shared/base-agent';
import { AgentConfig, AgentRequest, AgentResponse, GeneralMetadata } from '../shared/types';
import { validateGeneralRequest } from '../shared/validation';
import { handleAgentError } from '../shared/errors';
import { createChatCompletion } from '../shared/openai-client';

// General Agent クラス
class GeneralAgent extends BaseAgent {
  config: AgentConfig = {
    id: 'general',
    name: '一般エージェント',
    version: '1.0.0',
    inputType: 'json',
    capabilities: [{ type: 'text' }]
  };

  async process(request: AgentRequest<GeneralMetadata>): Promise<AgentResponse> {
    const startTime = Date.now();
    
    try {
      // リクエスト検証
      this.validateRequest(request);
      
      // システムプロンプトの構築
      const systemPrompt = this.buildSystemPrompt();
      
      // メッセージ履歴の構築
      const messages = this.buildMessages(systemPrompt, request);
      
      this.log('info', 'Processing general agent request', {
        messageLength: request.message.length,
        hasHistory: !!request.context?.history?.length
      });

      // OpenAI API呼び出し
      const completion = await createChatCompletion(messages, {
        temperature: 0.7,
        maxTokens: 2000
      });

      const content = completion.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response content from OpenAI API');
      }

      // レスポンス作成
      const response = this.createResponse(content, completion);
      const processingTime = Date.now() - startTime;
      
      // メトリクス記録
      this.recordMetrics(request, response, processingTime);
      
      return response;

    } catch (error) {
      this.handleError(error as Error);
    }
  }

  private buildSystemPrompt(): string {
    return `
あなたは製造業の専門AIアシスタントです。
設計、製造、材料、品質管理など製造業に関する質問に、実践的で分かりやすく回答してください。

必ず日本語で回答してください。
`;
  }

  private buildMessages(systemPrompt: string, request: AgentRequest<GeneralMetadata>) {
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
}

// API エンドポイント
export async function POST(request: NextRequest) {
  const agent = new GeneralAgent();
  
  try {
    const body = await request.json();
    const agentRequest = validateGeneralRequest(body);
    const response = await agent.process(agentRequest);
    
    return NextResponse.json(response);
  } catch (error) {
    return handleAgentError(error);
  }
}

// エージェント設定情報の取得
export async function GET() {
  const agent = new GeneralAgent();
  return NextResponse.json({
    config: agent.config,
    status: 'active',
    version: agent.config.version
  });
}