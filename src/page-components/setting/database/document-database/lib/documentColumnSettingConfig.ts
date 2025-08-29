import { ColumnConfig } from '@/widgets';

// 帳票タイプの定義
export interface DocumentType {
  id: string;
  name: string;
  defaultColumns: ColumnConfig[];
}

// 検査帳票のカラム設定
const INSPECTION_COLUMNS: ColumnConfig[] = [
  {
    id: 'name',
    name: '帳票名',
    description: '検査帳票の名前',
    displayEnabled: true,
    filterEnabled: true,
    dataType: 'text',
    order: 1,
  },
  {
    id: 'project_name',
    name: 'プロジェクト名',
    description: '紐付く案件名',
    displayEnabled: true,
    filterEnabled: true,
    dataType: 'text',
    order: 2,
  },
  {
    id: 'inspection_items_count',
    name: '検査項目数',
    description: '検査項目の総数',
    displayEnabled: true,
    filterEnabled: false,
    dataType: 'number',
    order: 3,
  },
  {
    id: 'inspection_date',
    name: '検査日',
    description: '検査を実施した日付',
    displayEnabled: true,
    filterEnabled: true,
    dataType: 'date',
    order: 4,
  },
  {
    id: 'inspection_result',
    name: '検査結果',
    description: '検査の合否結果',
    displayEnabled: true,
    filterEnabled: true,
    dataType: 'select',
    order: 5,
    options: [
      { id: 'pass', label: '合格', color: '#10B981' },
      { id: 're-inspect', label: '要再検査', color: '#EF4444' },
      { id: 'inspecting', label: '検査中', color: '#3B82F6' },
      { id: 'waiting', label: '検査待ち', color: '#F59E0B' }
    ],
  },
  {
    id: 'approval_status',
    name: '承認状況',
    description: '検査結果の承認状況',
    displayEnabled: true,
    filterEnabled: true,
    dataType: 'select',
    order: 6,
    options: [
      { id: 'approved', label: '承認済み', color: '#10B981' },
      { id: 'pending', label: '未承認', color: '#F59E0B' },
      { id: 'rejected', label: '差し戻し', color: '#EF4444' }
    ],
  },
  {
    id: 'updated_at',
    name: '最終更新日',
    description: '帳票の最終更新日時',
    displayEnabled: true,
    filterEnabled: true,
    dataType: 'date',
    order: 7,
  },
];

// 納品書のカラム設定
const DELIVERY_COLUMNS: ColumnConfig[] = [
  {
    id: 'name',
    name: '帳票名',
    description: '納品書の名前',
    displayEnabled: true,
    filterEnabled: true,
    dataType: 'text',
    order: 1,
  },
  {
    id: 'project_name',
    name: 'プロジェクト名',
    description: '紐付く案件名',
    displayEnabled: true,
    filterEnabled: true,
    dataType: 'text',
    order: 2,
  },
  {
    id: 'delivery_destination',
    name: '納品先',
    description: '製品の納品先',
    displayEnabled: true,
    filterEnabled: true,
    dataType: 'text',
    order: 3,
  },
  {
    id: 'delivery_date',
    name: '納品日',
    description: '製品を納品した日付',
    displayEnabled: true,
    filterEnabled: true,
    dataType: 'date',
    order: 4,
  },
  {
    id: 'inspection_scheduled_date',
    name: '検収予定日',
    description: '顧客による検収の予定日',
    displayEnabled: true,
    filterEnabled: true,
    dataType: 'date',
    order: 5,
  },
  {
    id: 'inspection_status',
    name: '検収状況',
    description: '顧客による検収の状況',
    displayEnabled: true,
    filterEnabled: true,
    dataType: 'select',
    order: 6,
    options: [
      { id: 'completed', label: '検収完了', color: '#10B981' },
      { id: 'waiting', label: '検収待ち', color: '#F59E0B' },
      { id: 'not-delivered', label: '未納品', color: '#6B7280' }
    ],
  },
  {
    id: 'updated_at',
    name: '最終更新日',
    description: '帳票の最終更新日時',
    displayEnabled: true,
    filterEnabled: true,
    dataType: 'date',
    order: 7,
  },
];

// 見積書のカラム設定（仕様書から）
const QUOTE_COLUMNS: ColumnConfig[] = [
  {
    id: 'quote_number',
    name: '見積番号',
    description: '見積書の管理番号',
    displayEnabled: true,
    filterEnabled: true,
    dataType: 'text',
    order: 1,
  },
  {
    id: 'customer_name',
    name: '顧客名',
    description: '見積先の顧客',
    displayEnabled: true,
    filterEnabled: true,
    dataType: 'text',
    order: 2,
  },
  {
    id: 'quote_details',
    name: '品目・数量・単価',
    description: '見積明細',
    displayEnabled: true,
    filterEnabled: false,
    dataType: 'text',
    order: 3,
  },
  {
    id: 'total_amount',
    name: '金額',
    description: '見積総額',
    displayEnabled: true,
    filterEnabled: true,
    dataType: 'number',
    order: 4,
  },
];

// 受注書のカラム設定（仕様書から）
const ORDER_COLUMNS: ColumnConfig[] = [
  {
    id: 'order_number',
    name: '受注番号',
    description: '顧客からの注文番号',
    displayEnabled: true,
    filterEnabled: true,
    dataType: 'text',
    order: 1,
  },
  {
    id: 'order_date',
    name: '受注日',
    description: '受注した日付',
    displayEnabled: true,
    filterEnabled: true,
    dataType: 'date',
    order: 2,
  },
  {
    id: 'customer_name',
    name: '顧客名',
    description: '受注元の顧客',
    displayEnabled: true,
    filterEnabled: true,
    dataType: 'text',
    order: 3,
  },
];

// 請求書のカラム設定（仕様書から）
const INVOICE_COLUMNS: ColumnConfig[] = [
  {
    id: 'invoice_number',
    name: '請求番号',
    description: '請求書の管理番号',
    displayEnabled: true,
    filterEnabled: true,
    dataType: 'text',
    order: 1,
  },
  {
    id: 'invoice_date',
    name: '請求日',
    description: '請求書発行日',
    displayEnabled: true,
    filterEnabled: true,
    dataType: 'date',
    order: 2,
  },
  {
    id: 'total_amount',
    name: '請求金額',
    description: '請求総額',
    displayEnabled: true,
    filterEnabled: true,
    dataType: 'number',
    order: 3,
  },
];

// 送り状のカラム設定（仕様書から）
const SHIPPING_COLUMNS: ColumnConfig[] = [
  {
    id: 'shipping_number',
    name: '送り状番号',
    description: '送り状の管理番号',
    displayEnabled: true,
    filterEnabled: true,
    dataType: 'text',
    order: 1,
  },
  {
    id: 'shipping_date',
    name: '出荷日',
    description: '製品を出荷した日付',
    displayEnabled: true,
    filterEnabled: true,
    dataType: 'date',
    order: 2,
  },
  {
    id: 'shipping_destination',
    name: '出荷先',
    description: '製品の出荷先',
    displayEnabled: true,
    filterEnabled: true,
    dataType: 'text',
    order: 3,
  },
];

// デフォルトの帳票タイプ
export const DEFAULT_DOCUMENT_TYPES: DocumentType[] = [
  {
    id: 'inspection',
    name: '検査帳票',
    defaultColumns: INSPECTION_COLUMNS,
  },
  {
    id: 'delivery',
    name: '納品書',
    defaultColumns: DELIVERY_COLUMNS,
  },
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
    id: 'invoice',
    name: '請求書',
    defaultColumns: INVOICE_COLUMNS,
  },
  {
    id: 'shipping',
    name: '送り状',
    defaultColumns: SHIPPING_COLUMNS,
  },
];

