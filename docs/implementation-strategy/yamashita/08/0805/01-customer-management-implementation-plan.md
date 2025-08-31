# 顧客管理ページ実装計画

## 1. 概要

既存のProjectContainerとBlueprintContainerのパターンを基に、顧客管理ページを実装する。
基本的な構造とフィルタリングサイドバー、ページヘッダー、テーブル表示、ページネーション機能は既存パターンと同様。

## 2. データ構造設計

### 2.1 Customer型定義

```typescript
export interface Customer {
  customerCode: string; // 取引先コード (例: "CUST-2024-001")
  customerName: string; // 取引先名 (例: "株式会社田中製作所")
  contactPerson: string; // 取引先担当者 (例: "田中太郎")
  salesRepresentative: string; // 営業担当者 (例: "山田花子")
  phoneNumber: string; // 電話番号 (例: "03-1234-5678")
  faxNumber: string; // FAX (例: "03-1234-5679")
  rank: 'S' | 'A' | 'B' | 'C'; // ランク
  industry: string; // 業界 (例: "自動車部品")
}
```

### 2.2 モックデータ構造

- `customer.json`: 顧客情報の配列
- 各種業界、ランク、担当者の多様なサンプルデータを含む

## 3. フィルター設定

### 3.1 フィルター構成 (customerFilterConfig.ts)

```typescript
export const CUSTOMER_FILTER_CONFIG: FilterConfig<Customer>[] = [
  {
    key: 'customerCode',
    label: '取引先コード',
    type: 'text',
    placeholder: 'コードで検索',
  },
  {
    key: 'customerName',
    label: '取引先名',
    type: 'text',
    placeholder: '会社名で検索',
  },
  {
    key: 'contactPerson',
    label: '取引先担当者',
    type: 'text',
    placeholder: '担当者名で検索',
  },
  {
    key: 'salesRepresentative',
    label: '営業担当者',
    type: 'text',
    placeholder: '営業担当で検索',
  },
  {
    key: 'rank',
    label: 'ランク',
    type: 'select',
    options: ['S', 'A', 'B', 'C'],
    defaultValue: 'all',
  },
  {
    key: 'industry',
    label: '業界',
    type: 'select',
    options: [
      '自動車部品',
      '産業機械',
      '電子部品',
      '食品加工',
      '医療機器',
      '航空宇宙',
      'その他',
    ],
    defaultValue: 'all',
  },
];
```

## 4. テーブル列設定

### 4.1 列定義 (customerColumns.tsx)

```typescript
export const customerColumns: DataTableColumn<Customer>[] = [
  {
    key: 'customerCode',
    label: '取引先コード',
    width: 120,
    sortable: true,
    editable: false,
    locked: true,
    sortType: 'string'
  },
  {
    key: 'customerName',
    label: '取引先名',
    width: 200,
    sortable: true,
    editable: true,
    locked: false,
    sortType: 'string'
  },
  {
    key: 'contactPerson',
    label: '取引先担当者',
    width: 120,
    sortable: true,
    editable: true,
    locked: false,
    sortType: 'string'
  },
  {
    key: 'salesRepresentative',
    label: '営業担当者',
    width: 120,
    sortable: true,
    editable: true,
    locked: false,
    sortType: 'string'
  },
  {
    key: 'phoneNumber',
    label: '電話番号',
    width: 130,
    sortable: false,
    editable: true,
    locked: false,
    inputType: 'text'
  },
  {
    key: 'faxNumber',
    label: 'FAX',
    width: 130,
    sortable: false,
    editable: true,
    locked: false,
    inputType: 'text'
  },
  {
    key: 'rank',
    label: 'ランク',
    width: 80,
    sortable: true,
    editable: true,
    locked: false,
    inputType: 'select',
    selectOptions: ['S', 'A', 'B', 'C'],
    sortType: 'string',
    render: (customer, value) => (
      <Badge variant={getRankVariant(value as string)}>
        {value}
      </Badge>
    )
  },
  {
    key: 'industry',
    label: '業界',
    width: 120,
    sortable: true,
    editable: true,
    locked: false,
    inputType: 'select',
    selectOptions: ['自動車部品', '産業機械', '電子部品', '食品加工', '医療機器', '航空宇宙', 'その他'],
    sortType: 'string'
  }
];
```

## 5. ページヘッダー機能

### 5.1 CustomerPageHeader.tsx

- **詳細フィルターボタン**: サイドバートグル機能
- **検索窓**: 取引先名、コード、担当者での横断検索
- **CSV出力**: 顧客情報のCSVエクスポート
- **新規取引先登録ボタン**: 新規顧客作成ダイアログ起動

### 5.2 検索対象フィールド

```typescript
const matchesSearch =
  customer.customerCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
  customer.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
  customer.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
  customer.salesRepresentative
    .toLowerCase()
    .includes(searchTerm.toLowerCase()) ||
  customer.industry.toLowerCase().includes(searchTerm.toLowerCase());
```

## 6. 実装ファイル構成

```
src/page-components/customer/
├── data/
│   └── customer.json                    # モックデータ
├── lib/
│   ├── customerColumns.tsx              # テーブル列定義
│   ├── customerFilterConfig.ts          # フィルター設定
│   ├── customerCsvConfig.ts             # CSV出力設定
│   └── index.ts                         # エクスポート
└── ui/
    ├── CustomerContainer.tsx            # メインコンテナ
    ├── CustomerPageHeader.tsx           # ページヘッダー
    ├── CustomerTableView.tsx            # テーブル表示
    ├── CustomerPagination.tsx           # ページネーション
    └── CreateCustomerDialog.tsx         # 新規作成ダイアログ
```

## 7. 実装ステップ

### フェーズ1: 基本構造の作成

1. ディレクトリ構造の作成
2. Customer型定義とモックデータ作成
3. フィルター設定とテーブル列定義
4. 基本的なCustomerContainer実装

### フェーズ2: UI コンポーネント実装

1. CustomerPageHeader実装
2. CustomerTableView実装 (既存BasicDataTableを使用)
3. CustomerPagination実装
4. フィルターサイドバー統合

### フェーズ3: 機能拡張

1. CreateCustomerDialog実装
2. CSV出力機能実装
3. ランクバッジスタイリング
4. 業界別色分け (オプション)

## 8. 既存パターンとの統一性

- **レイアウト**: `h-[calc(100vh-45px)] flex overflow-hidden`
- **サイドバー**: `ml-80` でのコンテンツ押し出し
- **ページング**: 20件/ページ
- **検索**: リアルタイム検索
- **フィルター**: AdvancedFilterSidebarとuseAdvancedFilterフック使用
- **テーブル**: BasicDataTableコンポーネント使用

## 9. 考慮事項

### 9.1 ユーザビリティ

- 取引先コードは編集不可とし、自動生成を想定
- ランクは視覚的にわかりやすいバッジ表示
- 電話番号・FAXはフォーマット検証を検討

### 9.2 データ整合性

- 営業担当者の選択肢は実際の社員リストと連携を想定
- 業界分類は標準的な分類を使用
- ランク付けの基準明確化

### 9.3 将来拡張

- 顧客詳細ページへのナビゲーション
- 取引履歴との連携
- 顧客分析機能
- 一括インポート機能

## 10. 技術仕様

- **フレームワーク**: Next.js 14 (App Router)
- **状態管理**: React useState
- **UI**: ShadCN/UI + Tailwind CSS
- **テーブル**: BasicDataTable (既存コンポーネント)
- **フィルター**: AdvancedFilterSidebar (既存フィーチャー)
- **アイコン**: Lucide React
- **型安全性**: TypeScript 完全対応
