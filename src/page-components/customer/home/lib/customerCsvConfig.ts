import { CsvColumnConfig } from '@/features';
import { Customer } from '../lib';

export const CUSTOMER_CSV_COLUMNS: Omit<CsvColumnConfig<Customer>, 'enabled'>[] = [
  { key: 'customerCode', label: '取引先コード' },
  { key: 'customerName', label: '取引先名' },
  { key: 'contactPerson', label: '取引先担当者' },
  { key: 'salesRepresentative', label: '営業担当者' },
  { key: 'phoneNumber', label: '電話番号' },
  { key: 'faxNumber', label: 'FAX番号' },
  { key: 'rank', label: 'ランク' },
  { key: 'industry', label: '業界' },
];