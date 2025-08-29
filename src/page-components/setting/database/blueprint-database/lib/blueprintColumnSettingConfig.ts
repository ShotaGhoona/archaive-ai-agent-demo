import { DatabaseColumnSettingConfig } from '@/widgets';

export const BLUEPRINT_COLUMN_SETTING_CONFIGS: DatabaseColumnSettingConfig[] = [
  {
    id: 'filename',
    name: 'ファイル名',
    dataType: 'text',
  },
  {
    id: 'orderSource',
    name: '発注元',
    dataType: 'text',
  },
  {
    id: 'productName',
    name: '製品名',
    dataType: 'text',
  },
  {
    id: 'internalNumber',
    name: '社内整番',
    dataType: 'text',
  },
  {
    id: 'customerNumber',
    name: '客先整番',
    dataType: 'text',
  },
  {
    id: 'cadName',
    name: 'CAD担当者',
    dataType: 'user',
  },
  {
    id: 'camName',
    name: 'CAM担当者',
    dataType: 'user',
  },
  {
    id: 'orderQuantity',
    name: '受注個数',
    dataType: 'number',
  },
  {
    id: 'orderDate',
    name: '受注日',
    dataType: 'date',
  },
  {
    id: 'deliveryDate',
    name: '納品日',
    dataType: 'date',
  },
  {
    id: 'maxDimensionL',
    name: '最大長',
    dataType: 'number',
  },
  {
    id: 'maxDimensionD',
    name: '最大幅',
    dataType: 'number',
  },
  {
    id: 'maxDimensionH',
    name: '最大高',
    dataType: 'number',
  },
  {
    id: 'companyField',
    name: '全社項目',
    dataType: 'text',
  },
];

// Blueprint固有の設定定数
export const BLUEPRINT_DATABASE_SETTING_CONFIG = {
  databaseType: 'blueprint' as const,
  pageTitle: '図面データベース設定',
  defaultColumns: BLUEPRINT_COLUMN_SETTING_CONFIGS,
} as const;