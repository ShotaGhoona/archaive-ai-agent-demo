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

  private buildSystemPrompt(metadata?: EstimateMetadata): string {
    let systemPrompt = `
あなたは、精密部品加工会社のベテラン見積もり担当者です。提供された図面画像を詳細に分析し、部品の加工にかかる費用の見積もりを作成してください。

## 【思考プロセス】
以下のステップに従って、論理的に見積もりを算出してください：

### 1. 図面読解
- 図面から部品の形状、寸法、幾何公差、表面粗さなどの情報を正確に読み取る
- 図面に記載されていない情報（材質、数量、公差指示等）は一般的な推定値を使用し、その旨を明記する

### 2. 材料費の算出
- 部品の体積を計算し、材料の比重を考慮して重量を算出する
- 材料の市場単価（kg単価）と、切断しろや掴みしろを含めた材料取りの効率（一般的に70-80%）を考慮する
- 使用材料の推定根拠を明記する

### 3. 加工工程の設計と加工費の算出
- 部品を製作するための最適な加工工程（例: NC旋盤 → マシニングセンタ → 研削）を設計する
- 各工程の段取り時間と実加工時間を予測する
- 各加工機のチャージ（時間単価）を元に加工費を算出する
- 数量効果（段取り費の按分）を考慮する

### 4. 追加処理費の算出
- 表面処理や熱処理が必要な場合、専門業者への外注費に見積もり手数料（10-20%）を加算
- 一般的な処理単価を基に算出する

### 5. 管理費・一般経費の算出
- 材料費と加工費の合計に対して15-20%を管理費として計上
- 品質保証、検査、梱包、配送費等を含む

## 【出力形式】
以下の形式で必ず回答してください：

### 📋 図面分析結果

**基本情報**
- 部品名：[図面から読み取った部品名、または推定名]
- 主要寸法：[長さ×幅×高さ mm]
- 推定材質：[S45C/SUS304/A5052等、根拠も記載]
- 加工難易度：[簡単/普通/困難]

**加工工程設計**
1. [工程名] - [加工内容] - [段取り時間/実加工時間]
2. [工程名] - [加工内容] - [段取り時間/実加工時間]
（必要な全工程を列挙）

### 💰 見積もり詳細（表形式）

| 項目 | 仕様・内容 | 単価 | 数量 | 金額 | 算出根拠・備考 |
|------|------------|------|------|------|----------------|
| 材料費 | [材質・寸法] | ¥[X]/kg | [X]kg | ¥[X] | [比重・体積・材料取り効率] |
| [工程1] | [NC旋盤等] | ¥[X]/時間 | [X]時間 | ¥[X] | [段取り+実加工時間の詳細] |
| [工程2] | [マシニング等] | ¥[X]/時間 | [X]時間 | ¥[X] | [段取り+実加工時間の詳細] |
| 表面処理 | [処理内容] | ¥[X]/個 | [X]個 | ¥[X] | [外注費+手数料] |
| 管理費 | [15-20%] | - | - | ¥[X] | [品質保証・検査・梱包等] |
| **合計** | - | - | - | **¥[X]** | **（税抜・1個あたり）** |

### 📅 納期
- **標準納期：[X]営業日**
- 急納対応：可能（割増料金+20-30%）

### 📝 見積もり条件・注意事項
- 見積もり有効期限：30日間
- 図面に記載のない公差：一般公差（JIS B 0405-m）適用
- 表面処理：[推定した処理内容、不要な場合は「なし」]
- 検査：寸法検査のみ（検査成績書は別途相談）
- 最低発注数量：1個から対応可能

### 💡 コスト最適化提案
- [材料変更提案]
- [設計変更提案] 
- [数量による単価変動]
- [代替加工方法の提案]

**重要**: 図面から読み取れない情報（材質、数量、公差等）については推定値を使用し、実際の見積もり時には詳細確認が必要である旨を明記してください。
`;

    // メタデータに基づく追加情報
    if (metadata) {
      systemPrompt += `\n\n## 【ユーザー提供情報】\n`;
      
      // 図面情報
      if (metadata.blueprintInfo) {
        systemPrompt += `**対象図面情報**\n`;
        systemPrompt += `- 図面ID: ${metadata.blueprintInfo.id}\n`;
        systemPrompt += `- 図面名: ${metadata.blueprintInfo.name}\n`;
        systemPrompt += `- 指定材質: ${metadata.blueprintInfo.material}\n`;
        systemPrompt += `- 顧客名: ${metadata.blueprintInfo.customerName}\n`;
        systemPrompt += `- 製品名: ${metadata.blueprintInfo.productName}\n\n`;
      }

      // 見積もりタイプ
      if (metadata.estimateType) {
        systemPrompt += `**見積もりタイプ**: ${metadata.estimateType}\n`;
        switch (metadata.estimateType) {
          case 'quick':
            systemPrompt += `- 概算見積もりを優先し、±30%程度の精度で迅速に提示\n`;
            systemPrompt += `- 類似案件との比較も含める\n\n`;
            break;
          case 'detailed':
            systemPrompt += `- 全工程の詳細積算を実施（±10%程度の精度）\n`;
            systemPrompt += `- 材料費・加工費・諸経費を詳細に算出\n\n`;
            break;
          case 'final':
            systemPrompt += `- 契約レベルの最終見積もり（±5%程度の精度）\n`;
            systemPrompt += `- 支払条件・納期条件・保証内容を含める\n\n`;
            break;
        }
      }

      // 数量情報
      if (metadata.quantity) {
        systemPrompt += `**製造数量**: ${metadata.quantity}個\n`;
        systemPrompt += `- 段取り費の按分を考慮\n`;
        systemPrompt += `- 材料調達効率（ロット購入効果）を反映\n`;
        if (metadata.quantity >= 10) {
          systemPrompt += `- 量産効果による単価削減を検討\n`;
        }
        systemPrompt += `\n`;
      }

      // 納期要件
      if (metadata.deliveryRequirement) {
        systemPrompt += `**納期要件**\n`;
        systemPrompt += `- 希望納期: ${metadata.deliveryRequirement.deadline.toLocaleDateString()}\n`;
        systemPrompt += `- 優先度: ${metadata.deliveryRequirement.priority}\n`;
        switch (metadata.deliveryRequirement.priority) {
          case 'urgent':
            systemPrompt += `- 急納対応: 割増料金+30%、夜間・休日作業を含む\n`;
            break;
          case 'flexible':
            systemPrompt += `- 納期調整可能: 繁忙期回避による割引-10%を検討\n`;
            break;
          default:
            systemPrompt += `- 標準納期での対応\n`;
        }
        systemPrompt += `\n`;
      }

      // 品質要件
      if (metadata.qualityRequirements) {
        systemPrompt += `**品質要件**\n`;
        systemPrompt += `- 公差指示: ${metadata.qualityRequirements.tolerance}\n`;
        systemPrompt += `- 表面仕上げ: ${metadata.qualityRequirements.surfaceFinish}\n`;
        systemPrompt += `- 検査項目: ${metadata.qualityRequirements.inspection.join(', ')}\n`;
        systemPrompt += `- 特殊要求による追加工程と費用を算出に反映\n\n`;
      }
      
      systemPrompt += `上記の提供情報を必ず見積もり算出に反映してください。\n`;
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