import { DatabaseColumnSettingConfig } from '@/widgets';

// Customerに特化したカラム定義（customerColumns.tsxベース）
export const CUSTOMER_COLUMN_SETTING_CONFIGS: DatabaseColumnSettingConfig[] = [
  {
    id: 'customerCode',
    name: '取引先コード',
    dataType: 'text',
  },
  {
    id: 'customerName',
    name: '取引先名',
    dataType: 'text',
  },
  {
    id: 'contactPerson',
    name: '取引先担当者',
    dataType: 'text',
  },
  {
    id: 'salesRepresentative',
    name: '営業担当者',
    dataType: 'user',
  },
  {
    id: 'phoneNumber',
    name: '電話番号',
    dataType: 'text',
  },
  {
    id: 'faxNumber',
    name: 'FAX',
    dataType: 'text',
  },
  {
    id: 'email',
    name: 'メールアドレス',
    dataType: 'text',
  },
  {
    id: 'address',
    name: '住所',
    dataType: 'text',
  },
  {
    id: 'rank',
    name: 'ランク',
    dataType: 'select',
    options: [
      { id: 'rank-s', label: 'S', color: '#3b82f6' },
      { id: 'rank-a', label: 'A', color: '#6b7280' },
      { id: 'rank-b', label: 'B', color: '#d1d5db' },
      { id: 'rank-c', label: 'C', color: '#ef4444' },
    ],
  },
  {
    id: 'industry',
    name: '業界',
    dataType: 'select',
    options: [
      { id: 'automotive', label: '自動車部品', color: '#10b981' },
      { id: 'industrial', label: '産業機械', color: '#3b82f6' },
      { id: 'electronics', label: '電子部品', color: '#f59e0b' },
      { id: 'food', label: '食品加工', color: '#8b5cf6' },
      { id: 'medical', label: '医療機器', color: '#ef4444' },
      { id: 'aerospace', label: '航空宇宙', color: '#06b6d4' },
      { id: 'other', label: 'その他', color: '#6b7280' },
    ],
  },
  {
    id: 'contractDate',
    name: '契約開始日',
    dataType: 'date',
  },
  {
    id: 'lastContactDate',
    name: '最終連絡日',
    dataType: 'date',
  },
  {
    id: 'isActive',
    name: 'アクティブ',
    dataType: 'boolean',
  },
];

// Customer固有の設定定数
export const CUSTOMER_DATABASE_SETTING_CONFIG = {
  databaseType: 'customer' as const,
  pageTitle: '顧客データベース設定',
  defaultColumns: CUSTOMER_COLUMN_SETTING_CONFIGS,
} as const;