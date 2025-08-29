import { DatabaseColumnSettingConfig } from '@/widgets';

// Projectに特化したカラム定義（projectTableConfig.tsxベース）
export const PROJECT_COLUMN_SETTING_CONFIGS: DatabaseColumnSettingConfig[] = [
  {
    id: 'projectId',
    name: '案件ID',
    dataType: 'text',
  },
  {
    id: 'customerName',
    name: '顧客名',
    dataType: 'text',
  },
  {
    id: 'assignee',
    name: '担当者',
    dataType: 'user',
  },
  {
    id: 'responseDeadline',
    name: '回答期日',
    dataType: 'date',
  },
  {
    id: 'workCompleteDate',
    name: '作業完了日',
    dataType: 'date',
  },
  {
    id: 'deliveryDeadline',
    name: '納品期日',
    dataType: 'date',
  },
  {
    id: 'receiptDate',
    name: '入荷期日',
    dataType: 'date',
  },
  {
    id: 'projectStatus',
    name: '案件状況',
    dataType: 'select',
    options: [
      { id: 'inquiry', label: '問い合わせ', color: '#3b82f6' },
      { id: 'estimating', label: '見積もり中', color: '#f59e0b' },
      { id: 'delivered', label: '納品', color: '#10b981' },
    ],
  },
  {
    id: 'quotationStatus',
    name: '見積書ステータス',
    dataType: 'select',
    options: [
      { id: 'not-submitted', label: '未提出', color: '#ef4444' },
      { id: 'in-progress', label: '作成中', color: '#f59e0b' },
      { id: 'submitted', label: '提出済', color: '#10b981' },
    ],
  },
  {
    id: 'deliveryStatus',
    name: '納品書ステータス',
      dataType: 'select',
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
    dataType: 'user',
  },
  {
    id: 'lastUpdatedAt',
    name: '最終更新日時',
    dataType: 'date',
  },
];

// Project固有の設定定数
export const PROJECT_DATABASE_SETTING_CONFIG = {
  databaseType: 'project' as const,
  pageTitle: '案件データベース設定',
  defaultColumns: PROJECT_COLUMN_SETTING_CONFIGS,
} as const;