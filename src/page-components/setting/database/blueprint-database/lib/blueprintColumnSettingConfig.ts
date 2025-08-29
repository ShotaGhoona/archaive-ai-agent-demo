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

// 図面テーブルのカラム設定
const BLUEPRINT_COLUMNS: DatabaseColumnSettingConfig[] = [
  {
    id: 'blueprint_id',
    name: '図面ID',
    description: '図面の一意識別子',
    dataType: 'text',
    editable: false,
  },
  {
    id: 'filename',
    name: 'ファイル名',
    description: '図面ファイル名',
    dataType: 'text',
  },
  {
    id: 'order_source',
    name: '発注元',
    description: '図面の発注元',
    dataType: 'text',
  },
  {
    id: 'product_name',
    name: '製品名',
    description: '図面の製品名',
    dataType: 'text',
  },
  {
    id: 'internal_number',
    name: '社内整番',
    description: '社内管理番号',
    dataType: 'text',
  },
  {
    id: 'customer_number',
    name: '客先整番',
    description: '客先管理番号',
    dataType: 'text',
  },
  {
    id: 'cad_user_id',
    name: 'CAD担当者',
    description: 'CAD作業担当者',
    dataType: 'user',
  },
  {
    id: 'cam_user_id',
    name: 'CAM担当者',
    description: 'CAM作業担当者',
    dataType: 'user',
  },
  {
    id: 'order_quantity',
    name: '受注個数',
    description: '受注した数量',
    dataType: 'number',
  },
  {
    id: 'order_date',
    name: '受注日',
    description: '受注した日付',
    dataType: 'date',
  },
  {
    id: 'delivery_date',
    name: '納品日',
    description: '納品予定日',
    dataType: 'date',
  },
  {
    id: 'max_dimension_l',
    name: '最大長',
    description: '製品の最大長（mm）',
    dataType: 'number',
  },
  {
    id: 'max_dimension_d',
    name: '最大幅',
    description: '製品の最大幅（mm）',
    dataType: 'number',
  },
  {
    id: 'max_dimension_h',
    name: '最大高',
    description: '製品の最大高（mm）',
    dataType: 'number',
  },
  {
    id: 'company_field',
    name: '全社項目',
    description: '全社共通の管理項目',
    dataType: 'text',
  },
  ...COMMON_COLUMNS,
];

// デフォルトのテーブル定義
export const DEFAULT_BLUEPRINT_TABLES = [
  {
    id: 'blueprint',
    name: '図面',
    defaultColumns: BLUEPRINT_COLUMNS,
  },
];