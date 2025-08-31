import { CsvColumnConfig } from '@/shared';
import { CustomerHomeDataInterface } from '@/dummy-data-er-fix/customer';

export const CUSTOMER_CSV_COLUMNS: Omit<
  CsvColumnConfig<CustomerHomeDataInterface>,
  'enabled'
>[] = [
  { key: 'seq_num', label: '顧客番号' },
  { key: 'name', label: '顧客名' },
  { key: 'name_kana', label: '顧客名（カナ）' },
  { key: 'customer_status', label: 'ステータス' },
  { key: 'annual_revenue', label: '年間売上高' },
  { key: 'head_count', label: '従業員数' },
  { key: 'website', label: 'Webサイト' },
  { key: 'remarks', label: '備考' },
  { key: 'in_charge_name', label: '営業担当者' },
  { key: 'created_at', label: '作成日時' },
  { key: 'updated_at', label: '最終更新日時' },
];
