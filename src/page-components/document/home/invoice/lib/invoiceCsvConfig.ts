import { CsvColumnConfig } from '@/shared';
import { Invoice } from '../model';

export const INVOICE_CSV_COLUMNS: Omit<CsvColumnConfig<Invoice>, 'enabled'>[] = [
  { key: 'name', label: '帳票名' },
  { key: 'project_name', label: 'プロジェクト名' },
  { key: 'billing_destination', label: '請求先' },
  { 
    key: 'billing_amount', 
    label: '請求金額',
    formatter: (value: unknown) => `¥${Number(value).toLocaleString()}`
  },
  { key: 'billing_date', label: '請求日',
    formatter: (value: unknown) => value ? new Date(value as string).toLocaleDateString('ja-JP') : '-'
  },
  { key: 'payment_due_date', label: '支払期限',
    formatter: (value: unknown) => value ? new Date(value as string).toLocaleDateString('ja-JP') : '-'
  },
  { key: 'payment_status', label: '支払状況' },
  {
    key: 'created_at',
    label: '作成日',
    formatter: (value: unknown) => new Date(value as string).toLocaleDateString('ja-JP')
  },
  {
    key: 'updated_at',
    label: '更新日',
    formatter: (value: unknown) => new Date(value as string).toLocaleDateString('ja-JP')
  }
];