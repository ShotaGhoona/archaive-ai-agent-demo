# 新規ページ開発ガイド

## 概要
このガイドは、FSDアーキテクチャに基づいた新規ページの開発手順をまとめたものです。
ドメイン駆動設計の原則に従い、ビジネス要件から実装まで段階的に進めます。

##重要
必ずタスクを整理してから実行を行いましょう。

## 開発フロー

### 1. ページ概要の定義
各ページのmdファイルを作ってこの内容を記載する

#### 1.1 基本情報
```yaml
ページ名: [例: 発注申請]
URL: [例: /order/application]
目的: [例: 店舗からの発注申請を作成・送信する]
```

#### 1.2 ユーザーストーリー
```
As a [店舗スタッフ]
I want to [商品を選択して発注申請を作成する]
So that [必要な商品を倉庫から調達できる]
```

#### 1.3 主要機能
- [ ] CRUD操作（作成・読取・更新・削除）
- [ ] 一覧表示・検索
- [ ] フィルタリング・ソート
- [ ] CSVエクスポート
- [ ] 承認ワークフロー
- [ ] その他: ___________

### 2. ドメインオブジェクト定義
domain_object.mdに記載

#### 2.1 エンティティ定義
```typescript
// entities/[domain]/model/types.ts
export interface [Domain] {
  id: number;              // 主キー
  // 必須フィールド
  name: string;            
  status: StatusType;      
  created_at: string;      
  updated_at: string;
  
  // オプショナルフィールド
  description?: string;    
  // リレーション
  user_id?: number;        
}

// 関連型定義
export type StatusType = 'draft' | 'active' | 'archived';

// 編集可能フィールド
export type Edit[Domain]Type = Pick<[Domain], 'name' | 'description'>;

// フィルター条件
export interface [Domain]Filter {
  search_text: string;
  status: StatusType[];
}
```

#### 2.2 ビジネスルール
- 必須項目: ___________
- バリデーション: ___________
- 状態遷移: draft → active → archived
- 権限: ___________

### 3. 機能要件と画面設計（30秒）
デザインするのが好ましいが、今回は東映のを参考にすれば良い
#### 3.1 画面構成
```
┌─────────────────────────────────────┐
│ Header: ページタイトル    [ボタン群] │
├─────────────────────────────────────┤
│ Filters: 検索・フィルター条件        │
├─────────────────────────────────────┤
│                                     │
│   Main Content:                     │
│   - テーブル/カード一覧              │
│   - ページネーション                 │
│                                     │
└─────────────────────────────────────┘

Modal/Dialog:
- 新規作成/編集フォーム
- 確認ダイアログ
- 詳細表示
```

#### 3.2 機能マトリクス
| 機能 | 優先度 | 実装レイヤー | 使用する既存コンポーネント |
|------|--------|------------|----------------------|
| 一覧表示 | 高 | widgets | DataTable |
| 新規作成 | 高 | features | Dialog, Form |
| 編集 | 高 | features | Dialog, Form |
| 削除 | 中 | features | AlertDialog |
| 検索 | 中 | widgets | SearchBar |
| フィルター | 中 | features | FilterChips |
| CSV出力 | 低 | page-components | ExportButton |

### 4. レイヤー別実装計画
ここまでの内容を元に実装計画のmdファイルを作成する
fsd_nextjs_integration.mdを参考に

#### 4.1 実装構造
```
app/[route]/page.tsx
    ↓
page-components/[page-name]/
├── ui/[PageName]Container.tsx      # ページコンテナ
├── model/use[PageName]Page.ts      # ページ状態管理
├── api/fetch[PageName].ts          # API呼び出し（必要時）
└── lib/use[PageName].ts            # ビジネスロジック
    ↓
widgets/[widget-name]/              # 再利用可能なUI
├── ui/[WidgetName].tsx             # Props駆動型UI
└── lib/use[WidgetName].ts          # UIロジック
    ↓
features/[feature-name]/            # 機能別実装
├── ui/[FeatureName]Modal.tsx       # 機能UI
├── lib/use[FeatureName].ts         # 機能ロジック
└── model/types.ts                  # 機能固有の型
    ↓
entities/[domain]/                  # ドメインエンティティ
├── api/[domain]Api.ts              # CRUD API
├── model/types.ts                  # 型定義
└── model/[domain]Slice.ts          # Redux状態管理
    ↓
shared/                             # 共通リソース
├── ui/                             # UIコンポーネント
├── lib/                            # ユーティリティ
└── api/mock-handlers/              # MSWハンドラー
```

#### 4.2 既存コンポーネント活用計画
```typescript
// 使用する共通コンポーネント
import {
  // レイアウト
  Card, CardHeader, CardContent,
  // データ表示
  DataTable, Loading,
  // フォーム
  Button, Input, Select,
  Form, FormField, FormItem,
  // フィードバック
  Dialog, AlertDialog, toast,
  // ユーティリティ
  usePopUp, useSelection,
} from '@/shared';

// 使用する既存widgets
import { SearchBar } from '@/widgets';

// 使用する既存features（あれば）
import { ItemFilterButtons } from '@/features/item-filtering';
```

### 5. 実装チェックリスト
コーディング規則はcoding_rules.mdに従う

#### Phase 1: 基盤構築（entities → shared）
- [ ] ドメインオブジェクトの型定義 (`entities/[domain]/model/types.ts`)
- [ ] Redux Sliceの作成 (`entities/[domain]/model/[domain]Slice.ts`)
- [ ] API実装 (`entities/[domain]/api/[domain]Api.ts`)
- [ ] MSWハンドラー作成 (`shared/api/mock-handlers/[domain].ts`)

#### Phase 2: 機能実装（features）
- [ ] 新規作成/編集モーダル (`features/[domain]-edit/`)
- [ ] フィルタリング機能 (`features/[domain]-filtering/`)
- [ ] その他の独立機能

#### Phase 3: UI構築（widgets → page-components）
- [ ] テーブル/リストWidget (`widgets/[domain]-table/`)
- [ ] ページコンテナ (`page-components/[page-name]/`)
- [ ] ページ状態管理フック

#### Phase 4: 統合とテスト
- [ ] ルーティング設定 (`app/[route]/page.tsx`)
- [ ] 動作確認（CRUD操作）
- [ ] エラーハンドリング確認
- [ ] レスポンシブ対応確認

## ベストプラクティス

### DO ✅
- **低レイヤーから実装**: entities → features → widgets → page-components
- **既存コンポーネントを優先**: 車輪の再発明を避ける
- **Props駆動設計**: 特にwidgets層では再利用性を重視
- **ロジック分離**: UIとビジネスロジックをカスタムフックに分離
- **型安全性**: anyの使用を避け、厳密な型定義を行う

### DON'T ❌
- **レイヤー違反**: 同一レイヤー間の依存や上位レイヤーへの依存
- **過度な事前設計**: MVPから始めて段階的に機能追加
- **巨大コンポーネント**: 単一責任の原則を守る
- **状態の重複**: Reduxとローカル状態の使い分けを明確に


---
*このガイドに従うことで、FSD原則に準拠した保守性の高いページを効率的に開発できます。*