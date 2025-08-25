import { CsvColumnConfig } from '@/features';
import { Quotation, Order, Delivery, Invoice, Specification, Inspection } from '../model';

export const QUOTATION_CSV_COLUMNS: Omit<CsvColumnConfig<Quotation>, 'enabled'>[] = [
  { key: 'name', label: '帳票名' },
  { key: 'project_name', label: '案件名' },
  { key: 'customer_name', label: '顧客名' },
  { 
    key: 'amount', 
    label: '見積金額',
    formatter: (value: unknown) => `¥${Number(value).toLocaleString()}`
  },
  { key: 'quotation_date', label: '見積日' },
  { key: 'expiry_date', label: '有効期限' },
  { key: 'approval_status', label: '承認状況' },
  { key: 'created_at', label: '作成日' },
  { key: 'updated_at', label: '更新日' },
];

export const ORDER_CSV_COLUMNS: Omit<CsvColumnConfig<Order>, 'enabled'>[] = [
  { key: 'name', label: '帳票名' },
  { key: 'project_name', label: '案件名' },
  { key: 'supplier_name', label: '発注先' },
  { 
    key: 'order_amount', 
    label: '発注金額',
    formatter: (value: unknown) => `¥${Number(value).toLocaleString()}`
  },
  { key: 'order_date', label: '発注日' },
  { key: 'delivery_date', label: '納期' },
  { key: 'approval_status', label: '承認状況' },
  { key: 'created_at', label: '作成日' },
  { key: 'updated_at', label: '更新日' },
];

export const DELIVERY_CSV_COLUMNS: Omit<CsvColumnConfig<Delivery>, 'enabled'>[] = [
  { key: 'name', label: '帳票名' },
  { key: 'project_name', label: '案件名' },
  { key: 'delivery_destination', label: '納品先' },
  { key: 'delivery_date', label: '納品日' },
  { key: 'inspection_scheduled_date', label: '検収予定日' },
  { key: 'inspection_status', label: '検収状況' },
  { key: 'created_at', label: '作成日' },
  { key: 'updated_at', label: '更新日' },
];

export const INVOICE_CSV_COLUMNS: Omit<CsvColumnConfig<Invoice>, 'enabled'>[] = [
  { key: 'name', label: '帳票名' },
  { key: 'project_name', label: '案件名' },
  { key: 'billing_destination', label: '請求先' },
  { 
    key: 'billing_amount', 
    label: '請求金額',
    formatter: (value: unknown) => `¥${Number(value).toLocaleString()}`
  },
  { key: 'billing_date', label: '請求日' },
  { key: 'payment_due_date', label: '支払期限' },
  { key: 'payment_status', label: '支払状況' },
  { key: 'created_at', label: '作成日' },
  { key: 'updated_at', label: '更新日' },
];

export const SPECIFICATION_CSV_COLUMNS: Omit<CsvColumnConfig<Specification>, 'enabled'>[] = [
  { key: 'name', label: '帳票名' },
  { key: 'project_name', label: '案件名' },
  { key: 'blueprint_name', label: '図面名' },
  { key: 'version', label: 'バージョン' },
  { key: 'approval_status', label: '承認状況' },
  { key: 'created_at', label: '作成日' },
  { key: 'updated_at', label: '更新日' },
];

export const INSPECTION_CSV_COLUMNS: Omit<CsvColumnConfig<Inspection>, 'enabled'>[] = [
  { key: 'name', label: '帳票名' },
  { key: 'project_name', label: '案件名' },
  { 
    key: 'inspection_items_count', 
    label: '検査項目数',
    formatter: (value: unknown) => `${Number(value)}項目`
  },
  { key: 'inspection_date', label: '検査日' },
  { key: 'inspection_result', label: '検査結果' },
  { key: 'approval_status', label: '承認状況' },
  { key: 'created_at', label: '作成日' },
  { key: 'updated_at', label: '更新日' },
];