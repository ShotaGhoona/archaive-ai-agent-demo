import { CsvColumnConfig } from '@/shared';
import { Quotation } from '../model';

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