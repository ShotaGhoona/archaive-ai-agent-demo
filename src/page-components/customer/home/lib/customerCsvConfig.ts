import { CsvColumnConfig } from '@/features';
import { Customer } from '../lib';

export const CUSTOMER_CSV_COLUMNS: Omit<CsvColumnConfig<Customer>, 'enabled'>[] = [
  { key: 'id', label: '顧客ID' },
  { key: 'name', label: '顧客名' },
  { key: 'company_id', label: '会社ID' },
  { key: 'created_at', label: '作成日' },
  { key: 'updated_at', label: '更新日' },
];