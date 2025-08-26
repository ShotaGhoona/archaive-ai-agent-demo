import { CsvColumnConfig } from '@/shared';
import { Order } from '../model';

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