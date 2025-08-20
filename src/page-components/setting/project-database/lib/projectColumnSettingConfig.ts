import { ColumnConfig } from '@/widgets/database-column-setting';

// Projectに特化したカラム定義（projectColumns.tsxベース）
export const PROJECT_COLUMN_SETTING_CONFIGS: ColumnConfig[] = [
  {
    id: 'projectId',
    name: '案件ID',
    displayEnabled: true,
    filterEnabled: true,
    dataType: 'text',
    order: 1,
  },
  {
    id: 'customerName',
    name: '顧客名',
    displayEnabled: true,
    filterEnabled: true,
    dataType: 'text',
    order: 2,
  },
  {
    id: 'assignee',
    name: '担当者',
    displayEnabled: true,
    filterEnabled: true,
    dataType: 'user',
    order: 3,
  },
  {
    id: 'responseDeadline',
    name: '回答期日',
    displayEnabled: true,
    filterEnabled: true,
    dataType: 'date',
    order: 4,
  },
  {
    id: 'workCompleteDate',
    name: '作業完了日',
    displayEnabled: true,
    filterEnabled: true,
    dataType: 'date',
    order: 5,
  },
  {
    id: 'deliveryDeadline',
    name: '納品期日',
    displayEnabled: true,
    filterEnabled: true,
    dataType: 'date',
    order: 6,
  },
  {
    id: 'receiptDate',
    name: '入荷期日',
    displayEnabled: true,
    filterEnabled: true,
    dataType: 'date',
    order: 7,
  },
  {
    id: 'projectStatus',
    name: '案件状況',
    displayEnabled: true,
    filterEnabled: true,
    dataType: 'select',
    order: 8,
    options: [
      { id: 'inquiry', label: '問い合わせ', color: '#3b82f6' },
      { id: 'estimating', label: '見積もり中', color: '#f59e0b' },
      { id: 'delivered', label: '納品', color: '#10b981' },
    ],
  },
  {
    id: 'quotationStatus',
    name: '見積書ステータス',
    displayEnabled: true,
    filterEnabled: true,
    dataType: 'select',
    order: 9,
    options: [
      { id: 'not-submitted', label: '未提出', color: '#ef4444' },
      { id: 'in-progress', label: '作成中', color: '#f59e0b' },
      { id: 'submitted', label: '提出済', color: '#10b981' },
    ],
  },
  {
    id: 'deliveryStatus',
    name: '納品書ステータス',
    displayEnabled: true,
    filterEnabled: true,
    dataType: 'select',
    order: 10,
    options: [
      { id: 'not-handled', label: '未対応', color: '#6b7280' },
      { id: 'preparing', label: '配送準備中', color: '#3b82f6' },
      { id: 'shipping', label: '配送中', color: '#f59e0b' },
      { id: 'completed', label: '配送完了', color: '#10b981' },
    ],
  },
  {
    id: 'lastUpdatedBy',
    name: '最終更新者',
    displayEnabled: false,
    filterEnabled: false,
    dataType: 'user',
    order: 11,
  },
  {
    id: 'lastUpdatedAt',
    name: '最終更新日時',
    displayEnabled: false,
    filterEnabled: true,
    dataType: 'date',
    order: 12,
  },
];

// Project固有の設定定数
export const PROJECT_DATABASE_SETTING_CONFIG = {
  databaseType: 'project' as const,
  pageTitle: '案件データベース設定',
  defaultColumns: PROJECT_COLUMN_SETTING_CONFIGS,
} as const;