import { CsvColumnConfig } from '@/shared';
import { Customer } from '../model';

export const CUSTOMER_CSV_COLUMNS: Omit<CsvColumnConfig<Customer>, 'enabled'>[] = [
  { key: 'id', label: '顧客ID' },
  { key: 'company_id', label: '会社ID' },
  { key: 'account_id', label: '取引先ID' },
  { key: 'account_name', label: '取引先名' },
  { key: 'account_name_kana', label: '取引先名（カナ）' },
  { key: 'account_type', label: '取引先種別' },
  { key: 'status', label: 'ステータス' },
  { key: 'annual_revenue', label: '年間売上高' },
  { key: 'employee_count', label: '従業員数' },
  { key: 'website', label: 'Webサイト' },
  { key: 'description', label: '取引先概要' },
  { key: 'created_at', label: '作成日時' },
  { key: 'updated_at', label: '最終更新日時' },
];