# 顧客連絡先リスト機能実装計画

## 1. 概要

既存の`src/page-components/customer/home`パターンを基に、特定顧客の連絡先リスト管理機能を実装する。
顧客詳細ページ（`/customer/[id]/contact`）内で、その顧客に紐づく複数の連絡先情報を管理する。

## 2. 要件分析

### 2.1 機能要件

- **表示**: 特定顧客の全連絡先を一覧表示
- **検索**: 連絡先名、部門、役職、電話番号等での検索
- **フィルター**: 部門別、役職別、連絡先タイプ別フィルタリング
- **CRUD**: 連絡先の追加、編集、削除
- **エクスポート**: 連絡先情報のCSVエクスポート
- **ページネーション**: 大量データ対応

### 2.2 既存パターンとの違い

- **スコープ**: 全顧客 → 特定顧客の連絡先
- **URL構造**: `/customer` → `/customer/[id]/contact`
- **データ取得**: 顧客IDベースでのフィルタリング
- **レイアウト**: CustomerSidebarと連携

## 3. データ構造設計

### 3.1 Contact型定義

```typescript
export interface Contact {
  contactId: string; // 連絡先ID (例: "CONT-2024-001")
  customerId: string; // 顧客ID (親顧客との関連)
  contactName: string; // 連絡先名 (例: "田中太郎")
  department: string; // 部門 (例: "営業部", "技術部", "経理部")
  position: string; // 役職 (例: "部長", "課長", "主任", "担当者")
  contactType: 'primary' | 'secondary' | 'emergency'; // 連絡先タイプ
  phoneNumber: string; // 電話番号 (例: "03-1234-5678")
  mobileNumber?: string; // 携帯電話 (オプション)
  email: string; // メールアドレス
  notes?: string; // 備考 (オプション)
  isActive: boolean; // アクティブ状態
  createdAt: string; // 作成日時
  updatedAt: string; // 更新日時
}
```

### 3.2 顧客-連絡先関係

```typescript
// 1顧客 : 複数連絡先の関係
// 連絡先データは顧客IDで紐づけ
interface CustomerContactRelation {
  customerId: string;
  contacts: Contact[];
}
```

### 3.3 モックデータ構造

- `contact.json`: 各顧客に対して3-8件程度の連絡先データ
- 多様な部門・役職・連絡先タイプのサンプル
- 実際の顧客IDとの整合性確保

## 4. フィルター設定

### 4.1 フィルター構成 (contactFilterConfig.ts)

```typescript
export const CONTACT_FILTER_CONFIG: FilterConfig<Contact>[] = [
  {
    key: 'contactName',
    label: '連絡先名',
    type: 'text',
    placeholder: '氏名で検索',
  },
  {
    key: 'department',
    label: '部門',
    type: 'select',
    options: [
      '営業部',
      '技術部',
      '製造部',
      '品質管理部',
      '経理部',
      '総務部',
      '企画部',
      'その他',
    ],
    defaultValue: 'all',
  },
  {
    key: 'position',
    label: '役職',
    type: 'select',
    options: ['取締役', '部長', '課長', '係長', '主任', '担当者', 'その他'],
    defaultValue: 'all',
  },
  {
    key: 'contactType',
    label: '連絡先タイプ',
    type: 'select',
    options: ['primary', 'secondary', 'emergency'],
    optionLabels: ['主要連絡先', '副次連絡先', '緊急連絡先'],
    defaultValue: 'all',
  },
  {
    key: 'isActive',
    label: 'ステータス',
    type: 'select',
    options: [true, false],
    optionLabels: ['アクティブ', '非アクティブ'],
    defaultValue: 'all',
  },
];
```

## 5. テーブル列設定

### 5.1 列定義 (contactColumns.tsx)

```typescript
export const createContactColumns = (callbacks: ContactColumnCallbacks): DataTableColumn<Contact>[] => [
  {
    key: 'contactName',
    label: '連絡先名',
    width: 120,
    sortable: true,
    editable: true,
    locked: false,
    sortType: 'string',
    render: (contact) => (
      <div className="flex items-center">
        <User className="w-4 h-4 mr-2 text-gray-500" />
        <span className="font-medium">{contact.contactName}</span>
      </div>
    )
  },
  {
    key: 'department',
    label: '部門',
    width: 100,
    sortable: true,
    editable: true,
    locked: false,
    inputType: 'select',
    selectOptions: ['営業部', '技術部', '製造部', '品質管理部', '経理部', '総務部', '企画部', 'その他'],
    sortType: 'string',
    render: (contact) => (
      <Badge variant="outline">{contact.department}</Badge>
    )
  },
  {
    key: 'position',
    label: '役職',
    width: 80,
    sortable: true,
    editable: true,
    locked: false,
    inputType: 'select',
    selectOptions: ['取締役', '部長', '課長', '係長', '主任', '担当者', 'その他'],
    sortType: 'string'
  },
  {
    key: 'contactType',
    label: 'タイプ',
    width: 100,
    sortable: true,
    editable: true,
    locked: false,
    inputType: 'select',
    selectOptions: ['primary', 'secondary', 'emergency'],
    selectLabels: ['主要', '副次', '緊急'],
    sortType: 'string',
    render: (contact) => (
      <Badge variant={getContactTypeVariant(contact.contactType)}>
        {getContactTypeLabel(contact.contactType)}
      </Badge>
    )
  },
  {
    key: 'phoneNumber',
    label: '電話番号',
    width: 130,
    sortable: false,
    editable: true,
    locked: false,
    inputType: 'text',
    render: (contact) => (
      <div className="flex items-center">
        <Phone className="w-4 h-4 mr-2 text-blue-500" />
        <span className="font-mono text-sm">{contact.phoneNumber}</span>
      </div>
    )
  },
  {
    key: 'email',
    label: 'メール',
    width: 200,
    sortable: true,
    editable: true,
    locked: false,
    inputType: 'email',
    sortType: 'string',
    render: (contact) => (
      <div className="flex items-center">
        <Mail className="w-4 h-4 mr-2 text-purple-500" />
        <a
          href={`mailto:${contact.email}`}
          className="text-blue-600 hover:text-blue-800 text-sm"
        >
          {contact.email}
        </a>
      </div>
    )
  },
  {
    key: 'isActive',
    label: 'ステータス',
    width: 80,
    sortable: true,
    editable: true,
    locked: false,
    inputType: 'select',
    selectOptions: [true, false],
    selectLabels: ['アクティブ', '非アクティブ'],
    sortType: 'boolean',
    render: (contact) => (
      <Badge variant={contact.isActive ? 'default' : 'secondary'}>
        {contact.isActive ? 'アクティブ' : '非アクティブ'}
      </Badge>
    )
  },
  {
    key: 'actions',
    label: '操作',
    width: 80,
    sortable: false,
    editable: false,
    locked: true,
    render: (contact) => (
      <ContactActionsDropdown
        contact={contact}
        onEdit={callbacks.onEdit}
        onDelete={callbacks.onDelete}
        onToggleActive={callbacks.onToggleActive}
      />
    )
  }
];
```

## 6. ページヘッダー機能

### 6.1 CustomerContactPageHeader.tsx

- **詳細フィルターボタン**: サイドバートグル機能
- **検索窓**: 連絡先名、メール、電話番号での横断検索
- **CSV出力**: 連絡先情報のCSVエクスポート
- **新規連絡先追加ボタン**: 新規連絡先作成ダイアログ起動
- **顧客情報表示**: 対象顧客名の表示

### 6.2 検索対象フィールド

```typescript
const matchesSearch =
  contact.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
  contact.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
  contact.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
  contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
  contact.phoneNumber.includes(searchTerm) ||
  (contact.mobileNumber && contact.mobileNumber.includes(searchTerm));
```

## 7. 実装ファイル構成

```
src/page-components/customer/contact/
├── data/
│   └── contact.json                     # モックデータ（全顧客の連絡先）
├── lib/
│   ├── contactColumns.tsx               # テーブル列定義
│   ├── contactFilterConfig.ts           # フィルター設定
│   ├── contactCsvConfig.ts              # CSV出力設定
│   ├── contactUtils.ts                  # ユーティリティ関数
│   └── index.ts                         # エクスポート
└── ui/
    ├── CustomerContactContainer.tsx     # メインコンテナ
    ├── CustomerContactPageHeader.tsx    # ページヘッダー
    ├── CustomerContactTableView.tsx     # テーブル表示
    ├── CreateContactDialog.tsx          # 新規作成ダイアログ
    ├── EditContactDialog.tsx            # 編集ダイアログ
    └── ContactActionsDropdown.tsx       # 操作ドロップダウン
```

## 8. コンテナコンポーネント設計

### 8.1 CustomerContactContainer.tsx

```typescript
interface CustomerContactContainerProps {
  customerId: string; // URLパラメータから取得
}

export default function CustomerContactContainer({ customerId }: CustomerContactContainerProps) {
  // 状態管理
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);

  // データ取得（顧客IDでフィルタリング）
  useEffect(() => {
    loadCustomerContacts(customerId);
    loadCustomerInfo(customerId);
  }, [customerId]);

  // フィルタリング処理
  const filteredContacts = useMemo(() => {
    return contacts.filter(contact =>
      contact.customerId === customerId &&
      matchesSearch(contact, searchTerm) &&
      matchesAdvancedFilters(contact, filters)
    );
  }, [contacts, customerId, searchTerm, filters]);

  return (
    <div className="h-full flex overflow-hidden">
      <AdvancedFilterSidebar
        isOpen={isFilterSidebarOpen}
        onClose={() => setIsFilterSidebarOpen(false)}
        config={CONTACT_FILTER_CONFIG}
        // ... フィルター設定
      />

      <div className={`flex-1 flex flex-col ${isFilterSidebarOpen ? 'ml-80' : ''}`}>
        <CustomerContactPageHeader
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onToggleFilter={() => setIsFilterSidebarOpen(!isFilterSidebarOpen)}
          onExportCsv={handleExportCsv}
          onCreate={handleCreateContact}
          customer={customer}
          contactCount={filteredContacts.length}
        />

        <CustomerContactTableView
          contacts={filteredContacts}
          onContactUpdate={handleContactUpdate}
          onContactDelete={handleContactDelete}
          loading={loading}
        />
      </div>
    </div>
  );
}
```

## 9. CSV出力設定

### 9.1 contactCsvConfig.ts

```typescript
export const CONTACT_CSV_COLUMNS: Omit<CsvColumnConfig<Contact>, 'enabled'>[] =
  [
    { key: 'contactId', label: '連絡先ID' },
    { key: 'contactName', label: '氏名' },
    { key: 'department', label: '部門' },
    { key: 'position', label: '役職' },
    { key: 'contactType', label: 'タイプ' },
    { key: 'phoneNumber', label: '電話番号' },
    { key: 'mobileNumber', label: '携帯電話' },
    { key: 'email', label: 'メールアドレス' },
    { key: 'notes', label: '備考' },
    { key: 'isActive', label: 'ステータス' },
    { key: 'createdAt', label: '作成日' },
    { key: 'updatedAt', label: '更新日' },
  ];
```

## 10. 新規作成・編集ダイアログ

### 10.1 CreateContactDialog.tsx

```typescript
const contactFormSchema = z.object({
  contactName: z.string().min(1, '連絡先名は必須です'),
  department: z.string().min(1, '部門は必須です'),
  position: z.string().min(1, '役職は必須です'),
  contactType: z.enum(['primary', 'secondary', 'emergency']),
  phoneNumber: z
    .string()
    .min(1, '電話番号は必須です')
    .regex(/^[0-9-+()]+$/, '有効な電話番号を入力してください'),
  mobileNumber: z.string().optional(),
  email: z.string().email('有効なメールアドレスを入力してください'),
  notes: z.string().optional(),
  isActive: z.boolean().default(true),
});

interface CreateContactDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (
    contact: Omit<
      Contact,
      'contactId' | 'customerId' | 'createdAt' | 'updatedAt'
    >,
  ) => void;
  customerId: string;
}
```

## 11. ユーティリティ関数

### 11.1 contactUtils.ts

```typescript
// 連絡先タイプのバリアント取得
export const getContactTypeVariant = (type: Contact['contactType']) => {
  switch (type) {
    case 'primary':
      return 'default';
    case 'secondary':
      return 'outline';
    case 'emergency':
      return 'destructive';
    default:
      return 'secondary';
  }
};

// 連絡先タイプのラベル取得
export const getContactTypeLabel = (type: Contact['contactType']) => {
  switch (type) {
    case 'primary':
      return '主要';
    case 'secondary':
      return '副次';
    case 'emergency':
      return '緊急';
    default:
      return type;
  }
};

// 連絡先IDの生成
export const generateContactId = () => {
  const date = new Date();
  const year = date.getFullYear();
  const timestamp = Date.now().toString().slice(-6);
  return `CONT-${year}-${timestamp}`;
};

// 電話番号のフォーマット
export const formatPhoneNumber = (phone: string) => {
  return phone.replace(/(\d{2,3})(\d{4})(\d{4})/, '$1-$2-$3');
};
```

## 12. レスポンシブ対応

### 12.1 モバイル表示

- テーブルは横スクロール対応
- フィルターサイドバーは下からスライドアップ
- 連絡先カード形式での表示オプション
- タッチ操作での編集・削除

### 12.2 タブレット表示

- サイドバー幅の調整
- 列幅の最適化
- ドロップダウンメニューのタッチ対応

## 13. 実装ステップ

### フェーズ1: データ層とライブラリ

1. Contact型定義作成
2. モックデータ作成（contact.json）
3. フィルター設定作成（contactFilterConfig.ts）
4. テーブル列定義作成（contactColumns.tsx）
5. CSV設定作成（contactCsvConfig.ts）
6. ユーティリティ関数作成（contactUtils.ts）

### フェーズ2: メインコンテナ

1. CustomerContactContainer.tsx実装
2. 顧客IDベースのデータフィルタリング
3. 検索・フィルター機能統合
4. 状態管理とデータフロー

### フェーズ3: UIコンポーネント

1. CustomerContactPageHeader.tsx実装
2. CustomerContactTableView.tsx実装
3. 既存BasicDataTableとの統合
4. レスポンシブ対応

### フェーズ4: CRUD機能

1. CreateContactDialog.tsx実装
2. EditContactDialog.tsx実装
3. ContactActionsDropdown.tsx実装
4. バリデーション・エラーハンドリング

### フェーズ5: 仕上げ

1. CSV出力機能
2. アクセシビリティ対応
3. パフォーマンス最適化
4. テスト・デバッグ

## 14. 技術仕様

- **フレームワーク**: Next.js 14 (App Router)
- **状態管理**: React useState + useEffect
- **UI**: ShadCN/UI + Tailwind CSS
- **テーブル**: BasicDataTable (統合ページネーション対応)
- **フィルター**: AdvancedFilterSidebar + useAdvancedFilter
- **フォーム**: React Hook Form + Zod
- **アイコン**: Lucide React
- **型安全性**: TypeScript完全対応

## 15. パフォーマンス考慮

### 15.1 データ最適化

- useMemo による計算結果キャッシュ
- 大量連絡先データの仮想化検討
- 検索デバウンス処理

### 15.2 レンダリング最適化

- React.memo によるコンポーネント最適化
- useCallback による関数メモ化
- 不要な再レンダリング防止

## 16. 将来拡張

### 16.1 機能拡張

- 連絡先のインポート/エクスポート機能
- 連絡先の一括編集機能
- 連絡履歴の追跡
- メール送信機能との統合

### 16.2 データ連携

- 実際のCRMシステムとの連携
- Active Directory との同期
- 名刺管理システムとの統合

## 17. セキュリティ考慮

- 個人情報の適切な取り扱い
- データの暗号化
- アクセス権限の制御
- 監査ログの記録
