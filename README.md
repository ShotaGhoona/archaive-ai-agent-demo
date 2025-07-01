# Archaive Demo - Blueprint AI Chat System

革新的なマルチステートAIチャットシステムを搭載した図面管理デモアプリケーションです。

## 🚀 主な機能

### 図面管理システム
- 図面の閲覧・管理
- 図面詳細情報の表示
- 複数図面の切り替え表示
- 図面操作ツール（印刷、ダウンロード、編集など）

### 革新的AIチャットシステム（5つのパターン）

#### Pattern 01: サイドバーチャット 🏠
右側固定パネルでの安定したチャット体験
- **特徴**: 図面作業と並行利用、安定した表示位置
- **最適な用途**: 日常的な図面作業時の相談

#### Pattern 02: 浮遊チャット ⚡
ドラッグ&リサイズ可能な自由度の高いチャット
- **特徴**: 自由な配置、ドラッグ移動、サイズ調整
- **最適な用途**: フレキシブルな作業環境

#### Pattern 03: 空間的チャット 🎯
図面上のクリック位置を基にした革新的な対話体験
- **特徴**: 図面上の注釈ポイント、空間コンテキスト理解
- **最適な用途**: 図面の特定箇所についての詳細相談

#### Pattern 04: 大画面チャット 📺
集中作業向けの大型モーダルチャット
- **特徴**: 95vh×95vw大画面、図面プレビュー、専用サイドバー
- **最適な用途**: 複雑な技術相談、詳細な分析

#### Pattern 05: マルチステートチャット 🔄 **【推奨】**
**3つの状態をシームレスに切り替え可能な究極のアダプティブUI**

## 🌟 Pattern 05 - マルチステートチャットの使い方

Pattern 05は、Pattern 01（サイドバー）、02（浮遊）、04（大画面）の3つのレイアウトを**一つのシステム内で自由に切り替え**できる革新的なチャットUIです。

### 基本操作

#### 1. チャット開始
```
右下の青いチャットボタンをクリック
↓
デフォルトで浮遊モード（Pattern 02）で開始
```

#### 2. レイアウト切り替え
チャットヘッダーの3つのボタンで瞬時に切り替え：

```
⚡ 浮遊モード   📄 サイドバーモード   🔲 フルページモード
```

- **⚡ 浮遊モード**: 自由な配置とサイズ調整
- **📄 サイドバーモード**: 右側固定で安定した表示
- **🔲 フルページモード**: 大画面での集中作業

#### 3. キーボードショートカット
```bash
Ctrl + 1    # 浮遊モードに切り替え
Ctrl + 2    # サイドバーモードに切り替え  
Ctrl + 3    # フルページモードに切り替え
Esc         # チャットを閉じる
```

### 浮遊モード操作

#### ドラッグ移動
- **ヘッダー部分をクリック&ドラッグ**: チャット全体を移動
- **画面境界を超えない**: 自動的に画面内に収まるよう調整

#### サイズ変更
- **右下角をドラッグ**: チャットウィンドウのサイズを調整
- **最小サイズ**: 300×400px
- **最大サイズ**: 画面サイズに応じて自動制限

### 高度な機能

#### 状態の記憶
- **レイアウト状態**: 前回使用した状態を自動復元
- **位置・サイズ**: 浮遊モードの位置とサイズを記憶
- **チャット履歴**: 図面ごとのメッセージ履歴を保持

#### スムーズアニメーション
全ての状態切り替えで滑らかなアニメーション：
- **GPU加速**: transform、opacityを使用した高性能アニメーション
- **段階的遷移**: 位置→サイズ→スタイルの順序で自然な変化
- **easing**: Material Design準拠のcubic-bezier

#### クイックアクション
各モードで利用可能：
```
+ ボタンから選択可能:
├── 図面をアップロード
├── 類似図面検索  
├── 寸法計算
├── 図面エクスポート
├── 写真を撮る
└── ファイル添付
```

## 🚀 セットアップ & 起動

### 必要な環境
- Node.js 18+
- npm / yarn / pnpm

### インストール
```bash
npm install
# または
yarn install
```

### 開発サーバー起動
```bash
npm run dev
# または
yarn dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開く

## 📂 プロジェクト構造

```
src/
├── app/
│   └── blueprints/[id]/
│       ├── 01/page.tsx          # Pattern 01: サイドバーチャット
│       ├── 02/page.tsx          # Pattern 02: 浮遊チャット
│       ├── 03/page.tsx          # Pattern 03: 空間的チャット
│       ├── 04/page.tsx          # Pattern 04: 大画面チャット
│       └── 05/page.tsx          # Pattern 05: マルチステート 🌟
│
├── components/feature/blueprint-detail/
│   ├── 01/                      # Pattern 01 実装
│   ├── 02/                      # Pattern 02 実装
│   ├── 03/                      # Pattern 03 実装
│   ├── 04/                      # Pattern 04 実装
│   └── 05/                      # Pattern 05 実装 🌟
│       ├── hooks/               # 状態管理フック
│       │   ├── useChatUIState.ts
│       │   └── useLayoutTransition.ts
│       ├── layouts/             # レイアウトコンポーネント
│       │   ├── FloatingLayout.tsx
│       │   ├── SidebarLayout.tsx
│       │   └── FullpageLayout.tsx
│       ├── shared/              # 共通コンポーネント
│       │   ├── ChatHeader.tsx
│       │   ├── ChatContent.tsx
│       │   ├── ChatInput.tsx
│       │   ├── ChatMessage.tsx
│       │   └── ChatButton.tsx
│       ├── utils/               # ユーティリティ
│       │   └── storageUtils.ts
│       ├── types.ts             # 型定義
│       └── index.tsx            # メインコントローラー
│
└── docs/                        # 各パターンの詳細仕様書
    ├── ai-chatbot-pattern-01.md
    ├── ai-chatbot-pattern-02.md  
    ├── ai-chatbot-pattern-03.md
    ├── ai-chatbot-pattern-04.md
    └── ai-chatbot-pattern-05.md 🌟
```

## 🎯 各パターンの体験方法

### 基本ワークフロー
1. **図面選択**: `/blueprints` で任意の図面を選択
2. **パターン体験**: 各パターンのページにアクセス
3. **チャット体験**: 右下のチャットボタンから対話開始

### URL構造
```
/blueprints/001/01    # Pattern 01: サイドバーチャット
/blueprints/001/02    # Pattern 02: 浮遊チャット  
/blueprints/001/03    # Pattern 03: 空間的チャット
/blueprints/001/04    # Pattern 04: 大画面チャット
/blueprints/001/05    # Pattern 05: マルチステート 🌟
```

## 🛠 技術仕様

### フロントエンド
- **Next.js 14** - App Router
- **TypeScript** - 型安全性
- **Tailwind CSS** - スタイリング
- **shadcn/ui** - UIコンポーネント

### 主要ライブラリ
- **Lucide React** - アイコン
- **React Hooks** - 状態管理
- **Web Animations API** - スムーズアニメーション

### 特徴的な技術実装
- **Custom Hooks**: 再利用可能な状態管理
- **Ref-based操作**: DOM直接操作によるパフォーマンス最適化
- **LocalStorage**: 状態永続化
- **GPU加速アニメーション**: 60fps保証
- **TypeScript徹底活用**: 型安全なコンポーネント設計

## 🎨 デザインシステム

### 色彩設計
```css
/* CSS Custom Properties 使用 */
--primary: 主要色（ブランドカラー）
--secondary: 補助色
--muted: ミュート色（背景など）
--border: ボーダー色
--foreground: 前景色（テキスト）
```

### アニメーション指針
- **Easing**: `cubic-bezier(0.4, 0, 0.2, 1)` - Material Design準拠
- **Duration**: 200ms〜500ms - 用途に応じた適切な時間
- **GPU加速**: `transform`, `opacity`の積極活用

## 📚 詳細ドキュメント

各パターンの詳細な仕様書は `docs/` フォルダに用意されています：

- [Pattern 01 仕様書](./docs/ai-chatbot-pattern-01.md) - サイドバーチャット
- [Pattern 02 仕様書](./docs/ai-chatbot-pattern-02.md) - 浮遊チャット
- [Pattern 03 仕様書](./docs/ai-chatbot-pattern-03.md) - 空間的チャット
- [Pattern 04 仕様書](./docs/ai-chatbot-pattern-04.md) - 大画面チャット
- [Pattern 05 仕様書](./docs/ai-chatbot-pattern-05.md) - マルチステート 🌟

## 🚀 推奨開発ワークフロー

### 1. Pattern 05での体験
```bash
# 最も高機能なPattern 05から体験開始
/blueprints/001/05
```

### 2. 各パターンの比較
```bash
# 他のパターンとの比較で特徴を理解
/blueprints/001/01  # シンプルなサイドバー
/blueprints/001/02  # 基本的な浮遊
/blueprints/001/04  # フルページ体験
```

### 3. カスタマイズ
- `types.ts`: インターフェース拡張
- `storageUtils.ts`: 永続化ロジック変更
- レイアウトコンポーネント: UI調整

## 🎯 今後の拡張可能性

### Phase 2機能（計画中）
- **Picture-in-Picture**: 小窓表示モード
- **Split-Screen**: 画面分割モード
- **マルチセッション**: 複数チャット同時管理

### Phase 3機能（計画中）
- **AI学習**: 使用パターンに基づく最適状態提案
- **テーマカスタマイズ**: ユーザー独自レイアウト
- **音声対話**: 音声入力・出力対応

---

**Pattern 05のマルチステートチャットで、これまでにない革新的なAI対話体験をお楽しみください！** 🚀