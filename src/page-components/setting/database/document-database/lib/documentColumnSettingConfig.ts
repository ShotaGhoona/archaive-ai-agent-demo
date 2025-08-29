import { DatabaseColumnSettingConfig } from '@/widgets';
import { Briefcase, PenTool, File } from 'lucide-react';
import { DocumentCategory } from '../model/types';

// 全てのテーブルに共通の項目
export const DOCUMENT_COMMON_COLUMNS: DatabaseColumnSettingConfig[] = [
  {
    id: 'created_date',
    name: '作成日時',
    description: 'レコード作成日時',
    dataType: 'date',
    editable: false,
    isRequired: true,
    showInBasicInfo: false,
    showInTable: true,
  },
  {
    id: 'created_user_id',
    name: '作成者',
    description: 'レコード作成者',
    dataType: 'user',
    editable: false,
    isRequired: true,
    showInBasicInfo: false,
    showInTable: true,
  },
  {
    id: 'modified_date',
    name: '更新日時',
    description: '最終更新日時',
    dataType: 'date',
    editable: false,
    isRequired: true,
    showInBasicInfo: false,
    showInTable: true,
  },
  {
    id: 'modified_user_id',
    name: '更新者',
    description: '最終更新ユーザー',
    dataType: 'user',
    editable: false,
    isRequired: true,
    showInBasicInfo: false,
    showInTable: true,
  },
  {
    id: 'remarks',
    name: '備考',
    description: '帳票に関しての備考',
    dataType: 'text',
    isRequired: false,
    showInBasicInfo: true,
    showInTable: true,
  },
];

// 仕様書のカラム設定（製品関連）
const SPECIFICATION_COLUMNS: DatabaseColumnSettingConfig[] = [
  {
    id: 'specification_id',
    name: '仕様書ID',
    description: '仕様書の一意識別子',
    dataType: 'text',
    editable: false,
    isRequired: true,
    showInBasicInfo: true,
    showInTable: true,
  },
  {
    id: 'product_id',
    name: '製品ID',
    description: '製品を一意に識別',
    dataType: 'text',
    editable: false,
    isRequired: true,
    showInBasicInfo: true,
    showInTable: true,
  },
  ...DOCUMENT_COMMON_COLUMNS,
];

// 工程図面のカラム設定（製品関連）
const PROCESS_DRAWING_COLUMNS: DatabaseColumnSettingConfig[] = [
  {
    id: 'process_drawing_id',
    name: '工程図面ID',
    description: '工程図面の一意識別子',
    dataType: 'text',
    editable: false,
    isRequired: true,
    showInBasicInfo: true,
    showInTable: true,
  },
  {
    id: 'product_id',
    name: '製品ID',
    description: '製品を一意に識別',
    dataType: 'text',
    editable: false,
    isRequired: true,
    showInBasicInfo: true,
    showInTable: true,
  },
  ...DOCUMENT_COMMON_COLUMNS,
];

// 治具・ツールのカラム設定（製品関連）
const JIG_TOOL_COLUMNS: DatabaseColumnSettingConfig[] = [
  {
    id: 'jig_tool_id',
    name: '治具ツールID',
    description: '治具・ツールの一意識別子',
    dataType: 'text',
    editable: false,
    isRequired: true,
    showInBasicInfo: true,
    showInTable: true,
  },
  {
    id: 'product_id',
    name: '製品ID',
    description: '製品を一意に識別',
    dataType: 'text',
    editable: false,
    isRequired: true,
    showInBasicInfo: true,
    showInTable: true,
  },
  ...DOCUMENT_COMMON_COLUMNS,
];

// 外注見積書のカラム設定（製品関連）
const OUTSOURCE_QUOTE_COLUMNS: DatabaseColumnSettingConfig[] = [
  {
    id: 'outsource_quote_id',
    name: '外注見積書ID',
    description: '外注見積書の一意識別子',
    dataType: 'text',
    editable: false,
    isRequired: true,
    showInBasicInfo: true,
    showInTable: true,
  },
  {
    id: 'product_id',
    name: '製品ID',
    description: '製品を一意に識別',
    dataType: 'text',
    editable: false,
    isRequired: true,
    showInBasicInfo: true,
    showInTable: true,
  },
  {
    id: 'quantity',
    name: '数量',
    description: '見積対象数量',
    dataType: 'number',
    isRequired: false,
    showInBasicInfo: false,
    showInTable: true,
  },
  {
    id: 'unit_price',
    name: '単価',
    description: '見積単価',
    dataType: 'number',
    isRequired: false,
    showInBasicInfo: false,
    showInTable: true,
  },
  {
    id: 'quote_amount',
    name: '見積金額',
    description: '見積金額（数量×単価）',
    dataType: 'number',
    isRequired: false,
    showInBasicInfo: false,
    showInTable: true,
  },
  {
    id: 'outsourcer_id',
    name: '外注先',
    description: '取引先idを紐付け',
    dataType: 'text',
    editable: false,
    isRequired: true,
    showInBasicInfo: true,
    showInTable: true,
  },
  ...DOCUMENT_COMMON_COLUMNS,
];

// 外注納品書のカラム設定（製品関連）
const OUTSOURCE_DELIVERY_COLUMNS: DatabaseColumnSettingConfig[] = [
  {
    id: 'outsource_delivery_id',
    name: '外注納品書ID',
    description: '外注納品書の一意識別子',
    dataType: 'text',
    editable: false,
    isRequired: true,
    showInBasicInfo: true,
    showInTable: true,
  },
  {
    id: 'product_id',
    name: '製品ID',
    description: '製品を一意に識別',
    dataType: 'text',
    editable: false,
    isRequired: true,
    showInBasicInfo: true,
    showInTable: true,
  },
  {
    id: 'order_number',
    name: '発注書番号',
    description: '紐づく発注書番号',
    dataType: 'text',
    isRequired: true,
    showInBasicInfo: true,
    showInTable: true,
  },
  {
    id: 'delivery_quantity',
    name: '納品数量',
    description: '実際に納品された数量',
    dataType: 'number',
    isRequired: true,
    showInBasicInfo: true,
    showInTable: true,
  },
  {
    id: 'delivery_date',
    name: '納品日',
    description: '納品日',
    dataType: 'date',
    isRequired: true,
    showInBasicInfo: true,
    showInTable: true,
  },
  {
    id: 'outsourcer_id',
    name: '外注先',
    description: '取引先idを紐付け',
    dataType: 'text',
    editable: false,
    isRequired: true,
    showInBasicInfo: true,
    showInTable: true,
  },
  ...DOCUMENT_COMMON_COLUMNS,
];

// 検査表のカラム設定（製品関連）
const INSPECTION_SHEET_COLUMNS: DatabaseColumnSettingConfig[] = [
  {
    id: 'inspection_sheet_id',
    name: '検査表ID',
    description: '検査表の一意識別子',
    dataType: 'text',
    editable: false,
    isRequired: true,
    showInBasicInfo: true,
    showInTable: true,
  },
  {
    id: 'product_id',
    name: '製品ID',
    description: '製品を一意に識別',
    dataType: 'text',
    editable: false,
    isRequired: true,
    showInBasicInfo: true,
    showInTable: true,
  },
  ...DOCUMENT_COMMON_COLUMNS,
];

// 工程表のカラム設定（製品関連）
const PROCESS_SHEET_COLUMNS: DatabaseColumnSettingConfig[] = [
  {
    id: 'process_sheet_id',
    name: '工程表ID',
    description: '工程表の一意識別子',
    dataType: 'text',
    editable: false,
    isRequired: true,
    showInBasicInfo: true,
    showInTable: true,
  },
  {
    id: 'product_id',
    name: '製品ID',
    description: '製品を一意に識別',
    dataType: 'text',
    editable: false,
    isRequired: true,
    showInBasicInfo: true,
    showInTable: true,
  },
  ...DOCUMENT_COMMON_COLUMNS,
];

// 生産計画表のカラム設定（製品関連）
const PRODUCTION_PLAN_COLUMNS: DatabaseColumnSettingConfig[] = [
  {
    id: 'production_plan_id',
    name: '生産計画表ID',
    description: '生産計画表の一意識別子',
    dataType: 'text',
    editable: false,
    isRequired: true,
    showInBasicInfo: true,
    showInTable: true,
  },
  {
    id: 'product_id',
    name: '製品ID',
    description: '製品を一意に識別',
    dataType: 'text',
    editable: false,
    isRequired: true,
    showInBasicInfo: true,
    showInTable: true,
  },
  ...DOCUMENT_COMMON_COLUMNS,
];

// 検査成績書のカラム設定（製品関連）
const INSPECTION_REPORT_COLUMNS: DatabaseColumnSettingConfig[] = [
  {
    id: 'inspection_report_id',
    name: '検査成績書ID',
    description: '検査成績書の一意識別子',
    dataType: 'text',
    editable: false,
    isRequired: true,
    showInBasicInfo: true,
    showInTable: true,
  },
  {
    id: 'product_id',
    name: '製品ID',
    description: '製品を一意に識別',
    dataType: 'text',
    editable: false,
    isRequired: true,
    showInBasicInfo: true,
    showInTable: true,
  },
  {
    id: 'inspection_datetime',
    name: '検査日時',
    description: '検査を行った日時',
    dataType: 'date',
    isRequired: true,
    showInBasicInfo: true,
    showInTable: true,
  },
  {
    id: 'inspector_user_name',
    name: '検査担当者',
    description: '社内検査担当者',
    dataType: 'user',
    isRequired: true,
    showInBasicInfo: true,
    showInTable: true,
  },
  ...DOCUMENT_COMMON_COLUMNS,
];

// 3DCADのカラム設定（製品関連）
const CAD_3D_COLUMNS: DatabaseColumnSettingConfig[] = [
  {
    id: 'product_id',
    name: '製品ID',
    description: '製品を一意に識別',
    dataType: 'text',
    editable: false,
    isRequired: true,
    showInBasicInfo: true,
    showInTable: true,
  },
  {
    id: 'file_name',
    name: 'ファイル名',
    description: 'CADファイル名',
    dataType: 'text',
    isRequired: true,
    showInBasicInfo: true,
    showInTable: true,
  },
  ...DOCUMENT_COMMON_COLUMNS,
];

// 納品書のカラム設定
const DELIVERY_COLUMNS: DatabaseColumnSettingConfig[] = [
  {
    id: 'delivery_note_id',
    name: '納品書ID',
    description: '納品書の一意識別子',
    dataType: 'text',
    editable: false,
    isRequired: true,
    showInBasicInfo: true,
    showInTable: true,
  },
  {
    id: 'project_id',
    name: '案件ID',
    description: '案件を一意に識別',
    dataType: 'text',
    editable: false,
    isRequired: true,
    showInBasicInfo: true,
    showInTable: true,
  },
  {
    id: 'delivery_number',
    name: '納品書番号',
    description: '納品を識別する番号',
    dataType: 'text',
    isRequired: true,
    showInBasicInfo: true,
    showInTable: true,
  },
  {
    id: 'delivery_date',
    name: '納品日',
    description: '製品を納品した日付',
    dataType: 'date',
    isRequired: true,
    showInBasicInfo: true,
    showInTable: true,
  },
  {
    id: 'delivery_address_id',
    name: '納品先',
    description: '顧客／納品先住所',
    dataType: 'text',
    editable: false,
    isRequired: true,
    showInBasicInfo: true,
    showInTable: true,
  },
  {
    id: 'delivery_details',
    name: '品目・数量',
    description: '納品内容',
    dataType: 'text',
    isRequired: false,
    showInBasicInfo: false,
    showInTable: true,
  },
  ...DOCUMENT_COMMON_COLUMNS,
];


// 受注書のカラム設定（仕様書から）
const ORDER_COLUMNS: DatabaseColumnSettingConfig[] = [
  {
    id: 'order_id',
    name: '受注書ID',
    description: '受注書の一意識別子',
    dataType: 'text',
    editable: false,
    isRequired: true,
    showInBasicInfo: true,
    showInTable: true,
  },
  {
    id: 'project_id',
    name: '案件ID',
    description: '案件を一意に識別',
    dataType: 'text',
    editable: false,
    isRequired: true,
    showInBasicInfo: true,
    showInTable: true,
  },
  {
    id: 'order_number',
    name: '受注番号',
    description: '顧客からの注文番号',
    dataType: 'text',
    isRequired: true,
    showInBasicInfo: true,
    showInTable: true,
  },
  {
    id: 'order_date',
    name: '受注日',
    description: '受注した日付',
    dataType: 'date',
    isRequired: true,
    showInBasicInfo: true,
    showInTable: true,
  },
  {
    id: 'customer_id',
    name: '顧客名',
    description: '受注元の顧客',
    dataType: 'text',
    editable: false,
    isRequired: true,
    showInBasicInfo: true,
    showInTable: true,
  },
  ...DOCUMENT_COMMON_COLUMNS,
];

// 請求書のカラム設定（仕様書から）
const INVOICE_COLUMNS: DatabaseColumnSettingConfig[] = [
  {
    id: 'invoice_id',
    name: '請求書ID',
    description: '請求書の一意識別子',
    dataType: 'text',
    editable: false,
    isRequired: true,
    showInBasicInfo: true,
    showInTable: true,
  },
  {
    id: 'project_id',
    name: '案件ID',
    description: '案件を一意に識別',
    dataType: 'text',
    editable: false,
    isRequired: true,
    showInBasicInfo: true,
    showInTable: true,
  },
  ...DOCUMENT_COMMON_COLUMNS,
];

// 送り状のカラム設定（仕様書から）
const SHIPPING_COLUMNS: DatabaseColumnSettingConfig[] = [
  {
    id: 'shipping_note_id',
    name: '送り状ID',
    description: '送り状の一意識別子',
    dataType: 'text',
    editable: false,
    isRequired: true,
    showInBasicInfo: true,
    showInTable: true,
  },
  {
    id: 'project_id',
    name: '案件ID',
    description: '案件を一意に識別',
    dataType: 'text',
    editable: false,
    isRequired: true,
    showInBasicInfo: true,
    showInTable: true,
  },
  {
    id: 'shipping_date',
    name: '出荷日',
    description: '製品を出荷した日付',
    dataType: 'date',
    isRequired: true,
    showInBasicInfo: true,
    showInTable: true,
  },
  ...DOCUMENT_COMMON_COLUMNS,
];


// デフォルトの帳票カテゴリ
export const DEFAULT_DOCUMENT_CATEGORIES: DocumentCategory[] = [
  {
    id: 'project-related',
    name: '案件に紐づく帳票',
    description: '案件IDによる紐付けで管理される帳票群',
    icon: Briefcase,
    documentTypes: [
      {
        id: 'order',
        name: '受注書',
        defaultColumns: ORDER_COLUMNS,
      },
      {
        id: 'delivery',
        name: '納品書',
        defaultColumns: DELIVERY_COLUMNS,
      },
      {
        id: 'invoice',
        name: '請求書',
        defaultColumns: INVOICE_COLUMNS,
      },
      {
        id: 'shipping',
        name: '送り状',
        defaultColumns: SHIPPING_COLUMNS,
      },
    ],
  },
  {
    id: 'product-related',
    name: '製品に紐づく帳票',
    description: '製品IDによる紐付けで管理される帳票群',
    icon: PenTool,
    documentTypes: [
      {
        id: 'specification',
        name: '仕様書',
        defaultColumns: SPECIFICATION_COLUMNS,
      },
      {
        id: 'process_drawing',
        name: '工程図面',
        defaultColumns: PROCESS_DRAWING_COLUMNS,
      },
      {
        id: 'jig_tool',
        name: '治具・ツール',
        defaultColumns: JIG_TOOL_COLUMNS,
      },
      {
        id: 'outsource_quote',
        name: '外注見積書',
        defaultColumns: OUTSOURCE_QUOTE_COLUMNS,
      },
      {
        id: 'outsource_delivery',
        name: '外注納品書',
        defaultColumns: OUTSOURCE_DELIVERY_COLUMNS,
      },
      {
        id: 'inspection_sheet',
        name: '検査表',
        defaultColumns: INSPECTION_SHEET_COLUMNS,
      },
      {
        id: 'process_sheet',
        name: '工程表',
        defaultColumns: PROCESS_SHEET_COLUMNS,
      },
      {
        id: 'production_plan',
        name: '生産計画表',
        defaultColumns: PRODUCTION_PLAN_COLUMNS,
      },
      {
        id: 'inspection_report',
        name: '検査成績書',
        defaultColumns: INSPECTION_REPORT_COLUMNS,
      },
      {
        id: 'cad_3d',
        name: '3DCAD',
        defaultColumns: CAD_3D_COLUMNS,
      },
    ],
  },
  {
    id: 'general',
    name: '一般帳票',
    description: '独立して管理される帳票群',
    icon: File,
    documentTypes: [],
  },
];

