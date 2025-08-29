import { DatabaseColumnSettingConfig } from '@/widgets';

// 全てのテーブルに共通の項目
export const COMMON_COLUMNS: DatabaseColumnSettingConfig[] = [
  {
    id: 'created_date',
    name: '作成日時',
    description: 'レコード作成日時',
    dataType: 'date',
    editable: false,
  },
  {
    id: 'created_user_id',
    name: '作成者',
    description: 'レコード作成者',
    dataType: 'user',
    editable: false,
  },
  {
    id: 'modified_date',
    name: '最終更新日時',
    description: '最終更新日時',
    dataType: 'date',
    editable: false,
  },
  {
    id: 'modified_user_id',
    name: '最終更新者',
    description: '最終更新ユーザー',
    dataType: 'user',
    editable: false,
  },
];

// 案件テーブルのカラム設定
const PROJECT_COLUMNS: DatabaseColumnSettingConfig[] = [
  {
    id: 'project_id',
    name: '案件ID',
    description: '案件の一意識別子',
    dataType: 'text',
    editable: false,
  },
  {
    id: 'customer_name',
    name: '顧客名',
    description: '案件の顧客名',
    dataType: 'text',
  },
  {
    id: 'assignee',
    name: '担当者',
    description: '案件担当者',
    dataType: 'user',
  },
  {
    id: 'response_deadline',
    name: '回答期日',
    description: '顧客への回答期日',
    dataType: 'date',
  },
  {
    id: 'work_complete_date',
    name: '作業完了日',
    description: '作業が完了した日',
    dataType: 'date',
  },
  {
    id: 'delivery_deadline',
    name: '納品期日',
    description: '納品の期日',
    dataType: 'date',
  },
  {
    id: 'receipt_date',
    name: '入荷期日',
    description: '材料等の入荷期日',
    dataType: 'date',
  },
  {
    id: 'project_status',
    name: '案件状況',
    description: '現在の案件状況',
    dataType: 'select',
    options: [
      { id: 'inquiry', label: '問い合わせ', color: '#3b82f6' },
      { id: 'estimating', label: '見積もり中', color: '#f59e0b' },
      { id: 'delivered', label: '納品', color: '#10b981' },
    ],
  },
  {
    id: 'quotation_status',
    name: '見積書ステータス',
    description: '見積書の作成状況',
    dataType: 'select',
    options: [
      { id: 'not-submitted', label: '未提出', color: '#ef4444' },
      { id: 'in-progress', label: '作成中', color: '#f59e0b' },
      { id: 'submitted', label: '提出済', color: '#10b981' },
    ],
  },
  {
    id: 'delivery_status',
    name: '納品書ステータス',
    description: '納品の進行状況',
    dataType: 'select',
    options: [
      { id: 'not-handled', label: '未対応', color: '#6b7280' },
      { id: 'preparing', label: '配送準備中', color: '#3b82f6' },
      { id: 'shipping', label: '配送中', color: '#f59e0b' },
      { id: 'completed', label: '配送完了', color: '#10b981' },
    ],
  },
  ...COMMON_COLUMNS,
];

// デフォルトのテーブル定義
export const DEFAULT_PROJECT_TABLES = [
  {
    id: 'project',
    name: '案件',
    defaultColumns: PROJECT_COLUMNS,
  },
];