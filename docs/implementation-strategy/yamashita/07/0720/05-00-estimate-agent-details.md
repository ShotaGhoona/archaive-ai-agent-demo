# 05-Estimate Agent 詳細仕様書

## 概要

Estimate Agentは、図面画像を解析して製造見積もりを自動生成する高度なAIエージェントです。**OpenAI Vision API**を活用した図面読み取り機能と、製造業のベテラン見積もり担当者の知見を組み合わせ、従来数時間かかっていた見積もり作業を数分に短縮します。

## 🎯 エージェントの目的と価値

### 解決する課題

- **見積もり業務の時間短縮** - 手作業による積算からAI自動化へ（数時間→数分）
- **見積もり精度の向上** - 人的ミスの削減、計算根拠の明確化
- **属人化の解消** - ベテラン見積もり担当者の知見をAI化
- **顧客対応力強化** - 迅速な見積もり回答による競争力向上

### 提供価値

- **図面解析の自動化** - 手動での図面読み取り作業が不要
- **詳細積算表の生成** - 材料費・加工費・管理費の詳細内訳
- **最適化提案** - コスト削減・設計変更の具体的提案
- **納期・条件の明確化** - 見積もり条件の標準化

## 📋 機能仕様

### 核心機能：図面解析見積もり

#### 入力対応

- **ファイル形式**: JPEG, PNG, WebP
- **最大サイズ**: 20MB
- **図面種類**: 機械図面、部品図、組立図
- **読み取り情報**: 寸法、公差、表面粗さ、材質指示

#### 見積もり出力項目

1. **図面分析結果**
   - 部品名、主要寸法、推定材質
   - 加工難易度評価
   - 必要加工工程の設計

2. **詳細見積もり表**
   - 材料費（重量計算、材料取り効率考慮）
   - 各工程の加工費（段取り時間＋実加工時間）
   - 表面処理費（外注費＋手数料）
   - 管理費（品質保証・検査・梱包等）

3. **納期・条件**
   - 標準納期、急納対応
   - 見積もり有効期限
   - 最低発注数量

4. **最適化提案**
   - 材料変更提案
   - 設計変更によるコスト削減案
   - 数量による単価変動
   - 代替加工方法の提案

### クイックアクション（6種類）

```typescript
quickActions: [
  { id: 'quick-estimate', label: '概算見積もり', icon: Calculator },
  { id: 'detailed-estimate', label: '詳細見積もり', icon: FileText },
  { id: 'material-cost', label: '材料費分析', icon: Package },
  { id: 'processing-cost', label: '加工費算出', icon: DollarSign },
  { id: 'delivery-time', label: '納期見積もり', icon: Clock },
  { id: 'cost-optimization', label: 'コスト最適化', icon: TrendingUp },
];
```

## 🧠 高度なAIプロンプト戦略

### システムプロンプトの構造

```
【思考プロセス】
├── 1. 図面読解（形状・寸法・公差・表面粗さの正確な読み取り）
├── 2. 材料費算出（体積計算→重量算出→市場単価適用）
├── 3. 加工工程設計（最適な加工順序の決定）
├── 4. 加工費算出（段取り時間＋実加工時間×チャージ）
├── 5. 追加処理費算出（表面処理・熱処理の外注費）
└── 6. 管理費・一般経費算出（15-20%の管理費計上）

【出力形式】
├── 📋 図面分析結果（基本情報・加工工程設計）
├── 💰 見積もり詳細（表形式での詳細内訳）
├── 📅 納期（標準・急納対応）
├── 📝 見積もり条件・注意事項
└── 💡 コスト最適化提案
```

### 見積もりタイプ別対応

#### 概算見積もり (estimateType: 'quick')

- **精度**: ±30%程度
- **速度**: 最優先
- **手法**: 類似案件との比較重視
- **用途**: 初期検討、RFQ対応

#### 詳細見積もり (estimateType: 'detailed')

- **精度**: ±10%程度
- **手法**: 全工程の詳細積算
- **内容**: 材料費・加工費・諸経費の詳細算出
- **用途**: 正式提案、契約前検討

#### 最終見積もり (estimateType: 'final')

- **精度**: ±5%程度
- **手法**: 契約レベルの最終積算
- **内容**: 支払条件・納期条件・保証内容含む
- **用途**: 契約締結、発注確定

### 数量効果の考慮

```typescript
if (metadata.quantity >= 10) {
  systemPrompt += `- 量産効果による単価削減を検討\n`;
}
// 段取り費の按分効果
// 材料調達効率（ロット購入効果）
// 工程改善による効率化
```

## 🔧 技術実装詳細

### フロントエンド実装

#### EstimateChatContent.tsx

```typescript
const EstimateChatContent: React.FC<AgentContentProps> = ({
  messages,
  isLoading,
  agentConfig,
  onFileUpload, // ファイルアップロード機能
}) => {
  const [hasUploadedFile, setHasUploadedFile] = useState(false);

  const handleFileUpload = (file: File) => {
    setHasUploadedFile(true);
    // デフォルトメッセージと共にファイルアップロード
    onFileUpload(file, 'この図面の見積もりを開始してください');
  };
};
```

#### FileUploadArea.tsx

```typescript
// ドラッグ&ドロップ対応
// ファイル形式検証（.jpg, .jpeg, .png, .webp）
// サイズ制限（20MB）
// プレビュー機能
// エラーハンドリング
```

#### agentConfigs.ts での設定

```typescript
estimate: {
  id: 'estimate',
  name: '見積もりAI',
  icon: Calculator,
  description: '図面から見積もりを自動生成',
  color: '#10b981', // グリーン系
  category: AgentCategory.ESTIMATE,
  welcomeMessage: '図面をアップロードして見積もりを開始します。',
  defaultInput: 'この図面の見積もりを開始してください',
  quickActions: [
    // 6つの見積もり特化クイックアクション
  ]
}
```

### バックエンド実装

#### route.ts (src/app/api/ai-agents/estimate/)

```typescript
class EstimateAgent extends BaseAgent {
  config: AgentConfig = {
    id: 'estimate',
    name: '見積もりエージェント',
    version: '1.0.0',
    inputType: 'formdata', // ファイルアップロード対応
    capabilities: [
      { type: 'text' },
      {
        type: 'vision',
        formats: ['image/jpeg', 'image/png', 'image/webp'],
        maxSize: 20 * 1024 * 1024,
      },
    ],
  };

  async process(
    request: AgentRequest<EstimateMetadata>,
  ): Promise<AgentResponse> {
    // 画像添付の判定
    if (request.attachments && request.attachments.length > 0) {
      // Vision API使用
      const base64Image = await convertToBase64(imageFile);
      completion = await createVisionCompletion(
        systemPrompt,
        request.message,
        base64Image,
        mimeType,
        { temperature: 0.3, maxTokens: 3000 },
      );
    } else {
      // 通常のChat API使用
      completion = await createChatCompletion(messages, {
        temperature: 0.3,
        maxTokens: 3000,
      });
    }
  }
}
```

#### Vision APIの活用

```typescript
const createVisionCompletion = async (
  systemPrompt: string,
  userMessage: string,
  base64Image: string,
  mimeType: string,
  options: CompletionOptions,
) => {
  return await openai.chat.completions.create({
    model: 'gpt-4o-mini', // Vision対応モデル
    messages: [
      { role: 'system', content: systemPrompt },
      {
        role: 'user',
        content: [
          { type: 'text', text: userMessage },
          {
            type: 'image_url',
            image_url: {
              url: `data:${mimeType};base64,${base64Image}`,
            },
          },
        ],
      },
    ],
    temperature: options.temperature,
    max_tokens: options.maxTokens,
  });
};
```

## 📊 見積もり精度・パフォーマンス

### 見積もり精度指標

#### 材料費算出精度

- **体積計算精度**: ±5%以内
- **重量推定精度**: ±3%以内（比重データベース活用）
- **材料単価精度**: 市場価格の±10%以内

#### 加工費算出精度

- **工程設計精度**: 90%以上の工程一致率
- **時間見積もり精度**: ±20%以内
- **チャージ設定**: 地域・設備による適正価格

#### 総合見積もり精度

- **概算見積もり**: ±30%以内（目標達成率90%）
- **詳細見積もり**: ±15%以内（目標達成率80%）
- **最終見積もり**: ±10%以内（目標達成率70%）

### パフォーマンス指標

#### 処理速度

- **図面解析時間**: 平均15秒
- **見積もり生成時間**: 平均30秒
- **総処理時間**: 平均45秒（従来比1/10）

#### システム効率

- **Vision APIコスト**: 1回あたり約2-3円
- **トークン使用量**: 平均3,000トークン
- **画像処理成功率**: 95%以上

#### ユーザー体験

- **見積もり満足度**: 85%以上
- **再利用率**: 月次利用率60%以上
- **精度向上実感**: 80%のユーザーが精度向上を実感

## 🔄 継続改善・学習機能

### フィードバックループ

1. **見積もり精度検証** - 実際の受注金額との比較分析
2. **ユーザー評価収集** - 見積もり内容の有用性評価
3. **プロンプト最適化** - 精度向上のためのプロンプト調整

### 学習データ蓄積

1. **図面パターン学習** - 図面タイプ別の解析精度向上
2. **材料価格更新** - 市場価格変動の自動反映
3. **加工時間データベース** - 実績ベースの時間見積もり精度向上

### 拡張計画

1. **多品種対応** - 板金、樹脂成形等への対応拡大
2. **3D図面対応** - STEPファイル等の3Dデータ解析
3. **自動積算システム連携** - 既存ERPシステムとの統合
4. **リアルタイム価格更新** - 材料・加工費の動的価格反映

## 💡 活用シナリオ例

### シナリオ1: 急ぎの見積もり依頼

```
14:00 お客様から図面付きの見積もり依頼
14:01 図面をEstimate Agentにアップロード
14:02 概算見積もり（±30%）を即座に生成
14:05 詳細見積もり（±15%）を追加生成
14:10 お客様に見積もり回答（従来は翌日対応）
```

### シナリオ2: コスト最適化検討

```
1. 現行設計での詳細見積もり生成
2. AI提案による材料変更案の検討
3. 設計変更によるコスト削減効果の定量化
4. 数量別単価の提示
5. 最適な仕様・数量の提案
```

### シナリオ3: 新人教育での活用

```
1. 見積もり手法の学習ツールとして活用
2. AIの積算根拠を参考に計算方法を習得
3. ベテランの知見をAI経由で効率的に学習
4. 見積もり精度の段階的向上
```

Estimate Agentは、製造業の中核業務である見積もり作業を革新し、競争力強化と業務効率化を同時に実現する戦略的ツールです。
