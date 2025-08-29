import { DatabaseColumnSettingConfig } from '@/widgets';
import { Briefcase, FileText, File } from 'lucide-react';
import { DocumentCategory } from '../model/types';

// 仕様書のカラム設定（製品関連）
const SPECIFICATION_COLUMNS: DatabaseColumnSettingConfig[] = [];

// 工程図面のカラム設定（製品関連）
const PROCESS_DRAWING_COLUMNS: DatabaseColumnSettingConfig[] = [];

// 治具・ツールのカラム設定（製品関連）
const JIG_TOOL_COLUMNS: DatabaseColumnSettingConfig[] = [];

// 外注見積書のカラム設定（製品関連）
const OUTSOURCE_QUOTE_COLUMNS: DatabaseColumnSettingConfig[] = [
  {
    id: 'quantity',
    name: '数量',
    description: '見積対象数量',
    dataType: 'number',
  },
  {
    id: 'unit_price',
    name: '単価',
    description: '見積単価',
    dataType: 'number',
  },
  {
    id: 'quote_amount',
    name: '見積金額',
    description: '見積金額（数量×単価）',
    dataType: 'number',
  },
];

// 外注納品書のカラム設定（製品関連）
const OUTSOURCE_DELIVERY_COLUMNS: DatabaseColumnSettingConfig[] = [
  {
    id: 'order_number',
    name: '発注書番号',
    description: '紐づく発注書番号',
    dataType: 'text',
  },
  {
    id: 'delivery_quantity',
    name: '納品数量',
    description: '実際に納品された数量',
    dataType: 'number',
  },
  {
    id: 'delivery_date',
    name: '納品日',
    description: '納品日',
    dataType: 'date',
  },
];

// 検査表のカラム設定（製品関連）
const INSPECTION_SHEET_COLUMNS: DatabaseColumnSettingConfig[] = [];

// 工程表のカラム設定（製品関連）
const PROCESS_SHEET_COLUMNS: DatabaseColumnSettingConfig[] = [];

// 生産計画表のカラム設定（製品関連）
const PRODUCTION_PLAN_COLUMNS: DatabaseColumnSettingConfig[] = [];

// 検査成績書のカラム設定（製品関連）
const INSPECTION_REPORT_COLUMNS: DatabaseColumnSettingConfig[] = [
  {
    id: 'inspection_datetime',
    name: '検査日時',
    description: '検査を行った日時',
    dataType: 'date',
  },
  {
    id: 'inspector_user_name',
    name: '検査担当者',
    description: '社内検査担当者',
    dataType: 'user',
  },
];

// 3DCADのカラム設定（製品関連）
const CAD_3D_COLUMNS: DatabaseColumnSettingConfig[] = [];

// 納品書のカラム設定
const DELIVERY_COLUMNS: DatabaseColumnSettingConfig[] = [
  {
    id: 'delivery_number',
    name: '納品書番号',
    description: '納品を識別する番号',
    dataType: 'text',
  },
  {
    id: 'delivery_date',
    name: '納品日',
    description: '製品を納品した日付',
    dataType: 'date',
  },
  {
    id: 'delivery_details',
    name: '品目・数量',
    description: '納品内容',
    dataType: 'text',
  },
];

// 見積書のカラム設定（仕様書から）
const QUOTE_COLUMNS: DatabaseColumnSettingConfig[] = [
  {
    id: 'total_amount',
    name: '金額',
    description: '見積総額',
    dataType: 'number',
  },
];

// 受注書のカラム設定（仕様書から）
const ORDER_COLUMNS: DatabaseColumnSettingConfig[] = [
  {
    id: 'order_number',
    name: '受注番号',
    description: '顧客からの注文番号',
    dataType: 'text',
  },
  {
    id: 'order_date',
    name: '受注日',
    description: '受注した日付',
    dataType: 'date',
  },
];

// 請求書のカラム設定（仕様書から）
const INVOICE_COLUMNS: DatabaseColumnSettingConfig[] = [
  {
    id: 'invoice_date',
    name: '請求日',
    description: '請求書発行日',
    dataType: 'date',
  },
];

// 送り状のカラム設定（仕様書から）
const SHIPPING_COLUMNS: DatabaseColumnSettingConfig[] = [
  {
    id: 'shipping_date',
    name: '出荷日',
    description: '製品を出荷した日付',
    dataType: 'date',
  },
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
        id: 'quote',
        name: '見積書',
        defaultColumns: QUOTE_COLUMNS,
      },
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
    icon: FileText,
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

