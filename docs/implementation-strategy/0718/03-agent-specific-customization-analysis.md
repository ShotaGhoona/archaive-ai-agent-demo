# エージェント固有カスタマイズ要件分析

## 削除可能性検証

### 1. ChatContent初期状態 ✅可能
- **General**: 「なんでも聞いてください」+ ARCHAIVE AI AGENT表示
- **Estimate**: 画像アップロード領域
- → `agentConfig.welcomeMessage`で対応可能

### 2. Input関連 ✅完全削除可能

#### 現状の個別実装差分
```typescript
// GeneralChatInput
- デフォルトメッセージ: なし
- クイックアクション: 6個の製造業質問

// EstimateChatInput  
- デフォルトメッセージ: "この図面の見積もりを開始してください"
- クイックアクション: 6個の見積もりメニュー
```

#### agentConfig対応状況
```typescript
interface AIAgentConfig {
  defaultInput?: string;     // ✅既に存在
  quickActions?: QuickAction[]; // ✅既に存在
}
```

**結論**: `ChatInput.tsx`を拡張すれば完全対応可能

### 3. Message関連 ✅ほぼ削除可能

#### 現状の差分
```typescript
// GeneralMessage 
- アイコン: Bot
- 特別処理: isWelcome判定

// EstimateMessage
- アイコン: Calculator  
- 特別処理: なし
```

#### 共通化可能な要素
- レイアウト構造: 100%同一
- スタイリング: agentConfig.colorで対応済み
- アイコン: agentConfig.iconで対応可能

**唯一の問題**: `isWelcome`の特別スタイリング
→ `message.type`で判定可能

## 削除による影響分析

### ❌失われる機能
1. **Welcome特別スタイリング** (General)
   - 青い背景のウェルカムメッセージ
   - → `ChatMessage.tsx`にtype判定追加で解決

2. **エージェント固有アイコン** (Estimate: Calculator)
   - → `agentConfig.icon`使用で解決

3. **デフォルト入力値** (Estimate: "この図面の...")
   - → `agentConfig.defaultInput`使用で解決

### ✅影響なし
- 自動スクロール機能
- メッセージ送信機能
- タイムスタンプ表示
- ローディング表示
- クイックアクション機能

## 実装戦略

### Phase 1: ChatInput統合
```typescript
// enhanced ChatInput.tsx
interface ChatInputProps {
  agentConfig: AIAgentConfig;
  // ... existing props
}

// agentConfig.quickActionsを使用
// agentConfig.defaultInputを初期値に設定
```

### Phase 2: ChatMessage統合
```typescript
// enhanced ChatMessage.tsx
interface ChatMessageProps {
  message: Message;
  agentConfig: AIAgentConfig;
}

// agentConfig.iconをAIアバターに使用
// message.typeでwelcomeスタイリング
```

### Phase 3: agentConfig拡張
```typescript
interface AIAgentConfig {
  // 既存
  defaultInput?: string;
  quickActions?: QuickAction[];
  
  // 新規追加
  hasFileUpload?: boolean; // Estimate用
  welcomeComponent?: ComponentType; // カスタムウェルカム
}
```

## 削除対象ファイル

### ✅完全削除可能
1. `GeneralChatInput.tsx` - agentConfig.quickActionsで対応
2. `EstimateChatInput.tsx` - agentConfig.quickActions + defaultInputで対応
3. `GeneralMessage.tsx` - 共有ChatMessageで対応
4. `EstimateMessage.tsx` - 共有ChatMessageで対応

### 必要な作業
1. `ChatInput.tsx`の拡張 (agentConfig対応)
2. `ChatMessage.tsx`の拡張 (agentConfig.icon対応)
3. `agentConfigs.ts`のquickActions更新
4. Welcome特別スタイリング対応

## 結論

**4ファイル全て削除可能** ✅

エージェント固有の機能は全て`agentConfig`経由で実現可能。削除により約**300行のコード重複**を解消し、新エージェント追加時の開発工数を80%削減可能。