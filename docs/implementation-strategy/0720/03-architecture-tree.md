# 03-アーキテクチャツリーとファイル構成

## 全体アーキテクチャ

```
ARCHAIVE AI Agent System
├── 🎯 Frontend (React/TypeScript)
│   ├── 🏗️ Feature Layer - AI Agent Components
│   └── 📡 API Communication
└── 🔧 Backend (Next.js API Routes)
    ├── 🤖 Agent Layer - Business Logic
    └── 🌐 External APIs (OpenAI)
```

## ディレクトリ構造とファイル役割

### 📁 Frontend - `src/components/feature/ai-agent/`

```
ai-agent/
├── 📄 index.tsx                    【メインエントリーポイント】
│   ↳ 全エージェントの統合管理、レイアウト制御
│
├── 🤖 agents/                      【エージェント固有コンポーネント】
│   ├── EstimateAgent/
│   │   ├── EstimateChatContent.tsx  【見積もりチャット表示】
│   │   │   ↳ ファイルアップロード機能統合
│   │   └── FileUploadArea.tsx       【図面アップロード】
│   │       ↳ ドラッグ&ドロップ、ファイル検証
│   │
│   ├── GeneralAgent/
│   │   └── GeneralChatContent.tsx   【一般相談チャット表示】
│   │       ↳ 基本的なメッセージ表示のみ
│   │
│   └── 📄 README.md                【エージェント追加手順書】
│       ↳ 新エージェント開発ガイド
│
├── 🔄 shared/                      【共有コンポーネント・ロジック】
│   ├── components/                 【再利用可能UIコンポーネント】
│   │   ├── ChatMessage.tsx         【💎コア】メッセージ表示
│   │   │   ↳ マークダウンレンダリング、エージェント色対応
│   │   ├── ChatInput.tsx           【💎コア】入力フィールド
│   │   │   ↳ クイックアクション、デフォルト値対応
│   │   ├── ChatContent.tsx         【💎コア】基本チャット表示
│   │   │   ↳ ほとんどのエージェントで使用
│   │   ├── ChatHeader.tsx          【ヘッダー】タイトル、設定
│   │   ├── ChatHistory.tsx         【履歴管理】過去の会話
│   │   ├── AgentSelector.tsx       【エージェント切替】
│   │   └── ChatButton.tsx          【起動ボタン】
│   │
│   ├── hooks/                      【カスタムReactフック】
│   │   ├── useChatUIState.ts       【状態管理】チャット状態
│   │   │   ↳ メッセージ、ローディング、エラー状態
│   │   └── useLayoutTransition.ts  【レイアウト制御】
│   │       ↳ スムーズなレイアウト切替
│   │
│   └── layouts/                    【レイアウトコンポーネント】
│       ├── FloatingLayout.tsx      【フローティング】ドラッグ可能
│       ├── SidebarLayout.tsx       【サイドバー】固定表示
│       └── FullpageLayout.tsx      【フルページ】モーダル式
│
├── 🏷️ types/                       【TypeScript型定義】
│   └── types.ts                    【共通型】エージェント、メッセージ等
│
└── ⚙️ utils/                       【ユーティリティ関数】
    ├── agentConfigs.ts             【💎最重要】エージェント設定
    │   ↳ 新エージェント追加はここから
    ├── agentRegistry.ts            【エージェント登録管理】
    ├── chatApi.ts                  【API通信】
    │   ↳ バックエンドとの通信ロジック
    └── storageUtils.ts             【ローカルストレージ】
        ↳ 履歴、設定の永続化
```

### 📁 Backend - `src/app/api/ai-agents/`

```
ai-agents/
├── 🎯 general/                     【一般エージェントAPI】
│   └── route.ts                    【一般相談エンドポイント】
│       ↳ 製造業コンサルタント特化プロンプト
│
├── 💰 estimate/                    【見積もりエージェントAPI】
│   └── route.ts                    【見積もりエンドポイント】
│       ↳ Vision API、図面解析、詳細積算ロジック
│
└── 🔧 shared/                      【共通バックエンドロジック】
    ├── base-agent.ts               【💎コア】基底エージェントクラス
    │   ↳ 共通機能（バリデーション、エラー処理、ログ）
    ├── types.ts                    【型定義】リクエスト・レスポンス
    ├── validation.ts               【入力検証】セキュリティ対策
    ├── errors.ts                   【エラーハンドリング】
    ├── openai-client.ts            【OpenAI API統合】
    │   ↳ Chat API、Vision API、コスト計算
    └── base-agent.ts               【基底クラス】
        ↳ 全エージェントが継承する共通機能
```

## 🔄 データフロー

### 1. ユーザー操作からAI応答まで

```
👤 User Action
├── 🔘 QuickAction Click → agentConfigs.ts → ChatInput.tsx
├── 💬 Message Input → ChatInput.tsx → chatApi.ts
├── 📎 File Upload → FileUploadArea.tsx → FormData
└── 🖱️ Layout Change → useLayoutTransition.ts
                    ↓
📡 API Communication (chatApi.ts)
├── POST /api/ai-agents/general → GeneralAgent.process()
└── POST /api/ai-agents/estimate → EstimateAgent.process()
                    ↓
🤖 AI Processing (BaseAgent)
├── 1. validateRequest() - 入力検証
├── 2. buildSystemPrompt() - プロンプト構築
├── 3. createChatCompletion() - OpenAI API呼び出し
└── 4. createResponse() - レスポンス整形
                    ↓
📱 UI Update
├── useChatUIState.ts - 状態更新
├── ChatMessage.tsx - マークダウンレンダリング
└── 自動スクロール、ローディング状態解除
```

### 2. 新エージェント追加の流れ

```
🆕 New Agent Creation
├── 1. agentConfigs.ts - 設定追加（UI動作）
├── 2. route.ts - APIエンドポイント作成（ビジネスロジック）
├── 3. Custom Component（必要な場合のみ）
└── 4. index.tsx - エージェント有効化
```

## 🎯 重要ファイルの役割詳細

| ファイル | 重要度 | 役割 | 初心者が理解すべきポイント |
|---------|--------|------|---------------------------|
| `agentConfigs.ts` | ⭐⭐⭐⭐⭐ | エージェント動作設定 | 新エージェント追加の80%はここで完了 |
| `base-agent.ts` | ⭐⭐⭐⭐⭐ | 共通ビジネスロジック | 全エージェントが継承する基盤 |
| `ChatMessage.tsx` | ⭐⭐⭐⭐ | メッセージ表示 | マークダウン対応、エージェント色 |
| `ChatInput.tsx` | ⭐⭐⭐⭐ | 入力制御 | クイックアクション統合 |
| `useChatUIState.ts` | ⭐⭐⭐ | 状態管理 | メッセージ・UI状態の中央管理 |
| `chatApi.ts` | ⭐⭐⭐ | API通信 | フロントエンド⇔バックエンド橋渡し |

この構造により、**設定駆動型**で**拡張性の高い**AIエージェントシステムを実現しています。