import { NextRequest, NextResponse } from 'next/server';
import { BaseAgent } from '../shared/base-agent';
import { AgentConfig, AgentRequest, AgentResponse, EstimateMetadata } from '../shared/types';
import { validateEstimateRequest } from '../shared/validation';
import { handleAgentError } from '../shared/errors';
import { createVisionCompletion, createChatCompletion } from '../shared/openai-client';

// Estimate Agent クラス
class EstimateAgent extends BaseAgent {
  config: AgentConfig = {
    id: 'estimate',
    name: '見積もりエージェント',
    version: '1.0.0',
    inputType: 'formdata',
    capabilities: [
      { type: 'text' },
      { 
        type: 'vision', 
        formats: ['image/jpeg', 'image/png', 'image/webp'],
        maxSize: 20 * 1024 * 1024 
      }
    ]
  };

  async process(request: AgentRequest<EstimateMetadata>): Promise<AgentResponse> {
    const startTime = Date.now();
    
    try {
      // リクエスト検証
      this.validateRequest(request);
      
      // システムプロンプトの構築
      const systemPrompt = this.buildSystemPrompt();
      
      this.log('info', 'Processing estimate agent request', {
        messageLength: request.message.length,
        hasImage: !!request.attachments?.length,
        estimateType: request.metadata?.estimateType
      });

      let completion;
      
      // 画像が添付されている場合はVision APIを使用
      if (request.attachments && request.attachments.length > 0) {
        const imageAttachment = request.attachments.find(att => att.type === 'image');
        if (imageAttachment && imageAttachment.data instanceof File) {
          // ファイルをBase64に変換
          const bytes = await imageAttachment.data.arrayBuffer();
          const buffer = Buffer.from(bytes);
          const base64Image = buffer.toString('base64');
          
          completion = await createVisionCompletion(
            systemPrompt,
            request.message,
            base64Image,
            imageAttachment.mimeType || 'image/jpeg',
            {
              temperature: 0.3, // 見積もりは正確性重視で低めに設定
              maxTokens: 3000 // 詳細な表形式出力のためトークン数を増加
            }
          );
        }
      } else {
        // テキストのみの場合は通常のChat API
        const messages = [
          { role: 'system' as const, content: systemPrompt },
          { role: 'user' as const, content: request.message }
        ];
        
        completion = await createChatCompletion(messages, {
          temperature: 0.3,
          maxTokens: 3000 // 詳細な表形式出力のためトークン数を増加
        });
      }

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
あなたは製造業の見積もり専門AIです。
アップロードされた図面を分析し、製造見積もりを作成してください。

## 出力形式
### 📋 図面分析
- 部品概要、主要寸法、推定材質

### 💰 見積もり
| 項目 | 単価 | 数量 | 金額 | 備考 |
|------|------|------|------|------|
| 材料費 | ¥X/kg | Xkg | ¥X | XX材、切りしろ含む |
| 加工費 | ¥X/時間 | X時間 | ¥X | XX加工、段取り含む |
| 合計 | - | - | ¥X | 税抜・1個あたり |

### 📅 納期
標準納期：X営業日

### 💡 最適化提案
- コスト削減案があれば提示

必ず日本語で、表形式を使って見やすく回答してください。
`;
  }
}

// API エンドポイント
export async function POST(request: NextRequest) {
  const agent = new EstimateAgent();
  
  try {
    const formData = await request.formData();
    const agentRequest = validateEstimateRequest(formData);
    const response = await agent.process(agentRequest);
    
    return NextResponse.json(response);
  } catch (error) {
    return handleAgentError(error);
  }
}

// エージェント設定情報の取得
export async function GET() {
  const agent = new EstimateAgent();
  return NextResponse.json({
    config: agent.config,
    status: 'active',
    version: agent.config.version
  });
}