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
      const systemPrompt = this.buildSystemPrompt(request.metadata);
      
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
              maxTokens: 2000
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
          maxTokens: 2000
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

  private buildSystemPrompt(metadata?: EstimateMetadata): string {
    let systemPrompt = `
あなたは製造業の専門見積もりエンジニアです。アップロードされた図面・CAD画像を詳細に分析し、正確な見積もりを提供してください。

## 分析項目
1. **寸法・形状分析**
   - 主要寸法の読み取り
   - 形状の複雑さ評価
   - 公差要求の確認

2. **材料分析**
   - 指定材料の特定
   - 材料使用量の計算
   - 材料コストの見積もり

3. **加工方法の判定**
   - 必要な加工工程の特定
   - 機械加工、板金、溶接等の工程分析
   - 加工難易度の評価

4. **品質要求**
   - 表面処理要求
   - 精度要求レベル
   - 検査項目

## 出力形式
以下の構造化された形式で回答してください：

### 📋 図面分析結果

**基本情報**
- 部品名：[図面から読み取った部品名]
- 主要寸法：[W×D×H mm]
- 材質：[指定材料]

**製造工程**
1. [工程1] - [加工内容] - [時間見積もり]
2. [工程2] - [加工内容] - [時間見積もり]
...

### 💰 見積もり詳細

**材料費**
- 材料使用量：[kg]
- 材料単価：[円/kg]
- 材料費小計：[金額]円

**加工費**
- 機械加工：[時間]時間 × [単価]円 = [金額]円
- その他工程：[詳細]
- 加工費小計：[金額]円

**その他費用**
- 表面処理：[金額]円
- 検査費：[金額]円

**合計見積もり**
- **総額：[金額]円（税抜）**
- **納期：[日数]営業日**

### 📝 注意事項・推奨事項
- [コスト削減提案]
- [設計変更提案]
- [製造上の注意点]

必ず日本語で回答し、具体的な数値を示してください。不明な部分があれば推定値として明記してください。
`;

    // メタデータに基づく追加情報
    if (metadata) {
      // 図面情報
      if (metadata.blueprintInfo) {
        systemPrompt += `\n\n## 対象図面情報\n`;
        systemPrompt += `- 図面ID: ${metadata.blueprintInfo.id}\n`;
        systemPrompt += `- 図面名: ${metadata.blueprintInfo.name}\n`;
        systemPrompt += `- 指定材質: ${metadata.blueprintInfo.material}\n`;
        systemPrompt += `- 顧客名: ${metadata.blueprintInfo.customerName}\n`;
        systemPrompt += `- 製品名: ${metadata.blueprintInfo.productName}\n`;
      }

      // 見積もりタイプ
      if (metadata.estimateType) {
        systemPrompt += `\n\n## 見積もりタイプ\n`;
        switch (metadata.estimateType) {
          case 'quick':
            systemPrompt += `概算見積もり: 迅速な価格提示を優先し、類似案件との比較を含めてください。\n`;
            break;
          case 'detailed':
            systemPrompt += `詳細見積もり: 全工程の積算を行い、材料費・加工費・諸経費を詳細に算出してください。\n`;
            break;
          case 'final':
            systemPrompt += `最終見積もり: 交渉余地・支払条件・納期条件を含む契約レベルの見積もりを作成してください。\n`;
            break;
        }
      }

      // 数量情報
      if (metadata.quantity) {
        systemPrompt += `\n\n## 製造数量\n`;
        systemPrompt += `予定数量: ${metadata.quantity}個\n`;
        systemPrompt += `数量スケールメリット、セットアップコスト配分、材料調達効率を考慮してください。\n`;
      }

      // 納期要件
      if (metadata.deliveryRequirement) {
        systemPrompt += `\n\n## 納期要件\n`;
        systemPrompt += `納期: ${metadata.deliveryRequirement.deadline.toLocaleDateString()}\n`;
        systemPrompt += `優先度: ${metadata.deliveryRequirement.priority}\n`;
        if (metadata.deliveryRequirement.priority === 'urgent') {
          systemPrompt += `急納対応のため、割増料金や代替工程の検討が必要です。\n`;
        }
      }

      // 品質要件
      if (metadata.qualityRequirements) {
        systemPrompt += `\n\n## 品質要件\n`;
        systemPrompt += `- 公差: ${metadata.qualityRequirements.tolerance}\n`;
        systemPrompt += `- 表面仕上げ: ${metadata.qualityRequirements.surfaceFinish}\n`;
        systemPrompt += `- 検査項目: ${metadata.qualityRequirements.inspection.join(', ')}\n`;
        systemPrompt += `これらの品質要件を満たすための追加工程と費用を考慮してください。\n`;
      }
    }

    return systemPrompt;
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