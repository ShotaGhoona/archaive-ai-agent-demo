# ARCHAIVE Demo - Manufacturing DX Platform

**Next.js + TypeScript + FSD Architecture による製造業向けデジタルトランスフォーメーション（DX）プラットフォームのデモアプリケーション**

## 概要

ARCHAIVE Demoは、製造業の設計・製造プロセスをデジタル化し、業務効率化を実現するWebアプリケーションです。図面管理、プロジェクト管理、顧客管理、AI支援機能を統合した包括的なプラットフォームを提供します。

### 主要機能

- 📄 **図面管理**: アップロード・仕分け・差分検出・類似図面検索
- 📋 **プロジェクト管理**: 案件進捗・見積もり・納期管理（テーブル・カンバン表示）
- 👥 **顧客管理**: 顧客情報・連絡先・プロジェクト履歴
- 🤖 **AIエージェント**: なんでもAI・見積もりAI・トラブルAI（マルチレイアウト対応）
- ⚙️ **マスタ管理**: 材料・工程・設備マスタ
- 📊 **高度なデータテーブル**: ソート・編集・固定列・ページネーション

## 技術スタック

### フロントエンド

- **React 19** - UIライブラリ
- **Next.js 15** - フルスタックフレームワーク（App Router）
- **TypeScript** - 型安全性
- **Tailwind CSS 4** - ユーティリティファーストCSS
- **shadcn/ui** - UIコンポーネント
- **React Hook Form + Zod** - フォーム管理・バリデーション

### AIエージェント

- **OpenAI API** - GPT-4o-mini
- **react-markdown** - マークダウンレンダリング
- **remark-gfm** - GitHub Flavored Markdown

### UI/UX

- **Lucide React** - アイコン
- **Recharts** - チャート・グラフ
- **react-resizable-panels** - リサイズ可能パネル
- **Sonner** - トースト通知

## アーキテクチャ

### FSD（Feature-Sliced Design）4層構造

ARCHAIVE Demoは、スケーラブルで保守性の高いコードベースを実現するため、FSDアーキテクチャを採用しています。

```
src/
├── shared/           # 共有基盤コンポーネント（最下層）
├── features/         # 機能単位モジュール
├── widgets/          # 複合ウィジェット
└── page-components/  # ページ固有コンポーネント（最上層）
```

**🚨 重要な制約**: 各層は自分より上の層のものをimportしてはいけません

### 各層の詳細

#### 📦 Shared層（共有基盤）

よく使うUIコンポーネントと基盤機能

- **shadcnui/**: Button、Card、Dialog等の基本UIコンポーネント
- **basic-data-table/**: 汎用データテーブル（ソート・編集・固定列対応）
- **basic-layout/**: ヘッダー・ナビゲーション・サイドバー
- **GenericSearch/**: 汎用検索機能
- **hooks/**: `use-mobile.ts`等の共通フック
- **lib/**: `utils.ts`等のユーティリティ関数

#### 🔧 Features層（機能モジュール）

使いまわせる機能をまとめた場所

- **csv-export/**: CSV出力機能
- **advanced-filter/**: サイドバーフィルター
- **file-preview/**: ファイル詳細確認（画像・PDF・CAD対応）
- **resizable-layout/**: ドラッグ&ドロップレイアウト調整
- **ai-agent/**: マルチエージェントAIチャット（3レイアウト対応）

#### 🧩 Widgets層（複合コンポーネント）

大きめのUIコンポーネント

- **blueprint-detail-layout/**: 図面詳細ページレイアウト
- **customer-detail-layout/**: 顧客詳細ページレイアウト
- **project-detail-layout/**: プロジェクト詳細ページレイアウト
- **v2-sidebar/**: フレキシブルフォルダシステム（macOS Finderライク）

#### 📄 Page-components層（ページ固有）

各ページの独自コンポーネント（app直下で使用）

- **blueprint/**: 図面管理（home, basic-information, estimate, similar等）
- **customer/**: 顧客管理（home, profile, contact, notes, project）
- **project/**: プロジェクト管理（home, basic-information, blueprint, quotation等）
- **setting/**: 設定管理（material-master, process-master, equipment-master）

### 各層の内部構造

```
feature-name/
├── ui/           # デザイン・UIコンポーネント
├── lib/          # ビジネスロジック・カスタムフック
├── model/        # 型定義・インターフェース
├── data/         # デモ用ダミーデータ（JSON）
└── index.ts      # エクスポート
```

## 主要機能詳細

### 🗂️ 図面管理

- **アップロード・仕分け**: ドラッグ&ドロップによる図面アップロードとプロジェクト別仕分け
- **差分検出**: 図面バージョン間の変更点自動検出・可視化
- **類似図面検索**: 既存図面との類似度分析・比較表示
- **3Dモデル連携**: CADファイルの3D表示・操作

### 📋 プロジェクト管理

- **テーブルビュー**: 高機能データテーブルによる案件一覧（ソート・フィルター・編集）
- **カンバンビュー**: ドラッグ&ドロップによる進捗管理
- **見積もり管理**: PDF出力対応の見積書作成・管理
- **工程管理**: 納期・工程・外注管理

### 👥 顧客管理

- **顧客プロフィール**: 基本情報・連絡先・取引履歴
- **プロジェクト履歴**: 顧客別案件一覧・進捗確認
- **ノート管理**: 顧客固有の備考・コミュニケーション履歴

### 🤖 AIエージェント

#### マルチエージェントシステム

- **なんでもAI**: 一般的な設計・製造相談（設計基本、材料選択、公差設定等）
- **見積もりAI**: 図面から概算・詳細見積もり生成（ファイルアップロード対応）
- **トラブルAI**: 製造トラブルの原因分析・対策提案

#### アダプティブUIレイアウト

- **フローティング**: ドラッグ可能なウィンドウ（位置・サイズ永続化）
- **サイドバー**: 固定サイドバー（レスポンシブ対応）
- **フルページ**: モーダル形式（チャット履歴サイドバー付き）

#### 技術的特徴

- OpenAI API統合（GPT-4o-mini）
- マークダウンレンダリング対応
- 設定駆動アーキテクチャ（`agentConfigs.ts`）
- リアルタイムストリーミング対応

### 📊 高度なデータテーブル

`shared/basic-data-table`による汎用データテーブル

#### 主要機能

- **ソート**: 文字列・数値・日付対応
- **インライン編集**: セル単位編集（text, number, select等）
- **固定列**: 左右の列固定表示（Sticky Columns）
- **ページネーション**: 大量データの分割表示
- **列幅調整**: マウスドラッグによるリサイズ
- **カスタムレンダリング**: セル表示内容のカスタマイズ

## セットアップ

### 前提条件

- Node.js 18以上
- npm/yarn/pnpm

### インストール

```bash
# リポジトリクローン
git clone <repository-url>
cd archaive-demo

# 依存関係インストール
npm install

# 開発サーバー起動
npm run dev
```

### 環境変数設定

`.env.local`ファイルを作成し、以下を設定：

```env
# OpenAI API（AIエージェント機能用）
OPENAI_API_KEY=your_openai_api_key_here
```

### ビルド・デプロイ

```bash
# プロダクションビルド
npm run build

# プロダクションサーバー起動
npm start

# Lint実行
npm run lint
```

## ディレクトリ構造

```
archaive-demo/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── blueprint/          # 図面管理ページ
│   │   ├── customer/           # 顧客管理ページ
│   │   ├── project/            # プロジェクト管理ページ
│   │   ├── setting/            # 設定ページ
│   │   └── api/                # API エンドポイント
│   ├── shared/                 # 共有基盤（最下層）
│   ├── features/               # 機能モジュール
│   ├── widgets/                # 複合ウィジェット
│   └── page-components/        # ページ固有（最上層）
├── public/                     # 静的ファイル
├── docs/                       # ドキュメント
└── components.json             # shadcn/ui設定
```

## 開発ガイドライン

### FSDアーキテクチャ準拠

1. **依存関係の方向**: 下位層から上位層への一方向のみ
2. **層内構造**: `ui/`, `lib/`, `model/`, `data/`の統一
3. **型安全性**: TypeScriptの型定義を必ず作成
4. **再利用性**: 共通機能は適切な層に配置

### コーディング規約

- **ESLint**: `npm run lint`で構文チェック
- **TypeScript**: 型安全性を重視した実装
- **Tailwind CSS**: ユーティリティクラスによるスタイリング
- **shadcn/ui**: 基本UIコンポーネントの活用

### 新機能追加時の指針

1. **shared層**: 全アプリで使用する基盤機能
2. **features層**: 特定機能に特化したモジュール
3. **widgets層**: ページ固有の複合コンポーネント
4. **page-components層**: 具体的なページ実装

## パフォーマンス最適化

- **Code Splitting**: 機能単位での動的インポート
- **React Memo**: 不要な再描画防止
- **Image Optimization**: Next.jsの画像最適化機能
- **Bundle Analysis**: 適切なバンドルサイズ管理

## ブラウザサポート

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## ライセンス

このプロジェクトは社内利用のデモアプリケーションです。

## 貢献

新機能の追加や改善は、FSDアーキテクチャの原則に従って実装してください。各層の`README.md`も参考にしてください。

---

**ARCHAIVE Demo** - 製造業の未来を切り拓くDXプラットフォーム
