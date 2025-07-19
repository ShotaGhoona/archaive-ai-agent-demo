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
      const systemPrompt = this.buildSystemPrompt(request.metadata);
      
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

  private buildSystemPrompt(metadata?: GeneralMetadata): string {
    let systemPrompt = `
あなたは製造業の専門コンサルタントです。設計、製造、品質管理、材料工学に関する幅広い知識を持ち、実践的でわかりやすいアドバイスを提供します。

## 専門分野
- 機械設計・CAD設計
- 材料選定・材料特性
- 製造工程・加工技術
- 品質管理・検査技術
- 安全管理・規格対応
- コスト最適化・生産性向上

## 回答方針
1. **実践的**: 実際の現場で使える具体的な情報を提供
2. **わかりやすさ**: 専門用語は必要に応じて解説
3. **安全性**: 安全性を最優先に考慮したアドバイス
4. **効率性**: コストと品質のバランスを重視
5. **最新性**: 業界の最新動向や技術を反映

## 対応内容
- 設計に関する技術的質問
- 材料選定や特性に関する相談
- 製造工程の最適化提案
- 品質管理・検査方法の助言
- 安全基準・規格に関する情報
- トラブルシューティング
- 一般的な製造業務の相談

必ず日本語で回答し、専門的でありながら理解しやすい説明を心がけてください。
`;

    // ユーザープリファレンスの適用
    if (metadata?.preferences) {
      const { experienceLevel, preferredUnits, industryFocus } = metadata.preferences;
      
      if (experienceLevel) {
        systemPrompt += `\n## ユーザーレベル\n`;
        switch (experienceLevel) {
          case 'beginner':
            systemPrompt += `初心者向け: 基本的な概念から丁寧に説明し、専門用語は必ず解説してください。\n`;
            break;
          case 'intermediate':
            systemPrompt += `中級者向け: 適度な専門性を保ちながら、実践的な情報を重視してください。\n`;
            break;
          case 'expert':
            systemPrompt += `上級者向け: 高度な技術情報や最新動向を含め、詳細な分析を提供してください。\n`;
            break;
        }
      }

      if (preferredUnits) {
        systemPrompt += `\n## 単位系\n`;
        if (preferredUnits === 'metric') {
          systemPrompt += `メートル法（mm, kg, MPa等）を使用してください。\n`;
        } else {
          systemPrompt += `ヤード・ポンド法（inch, lb, psi等）を使用してください。\n`;
        }
      }

      if (industryFocus && industryFocus.length > 0) {
        systemPrompt += `\n## 業界フォーカス\n`;
        systemPrompt += `特に以下の業界に関連する情報を重視してください: ${industryFocus.join(', ')}\n`;
      }
    }

    return systemPrompt;
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