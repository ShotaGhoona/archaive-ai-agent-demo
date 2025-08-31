import { CsvColumnConfig } from '@/shared';
import { DocumentQuotationDataInterface } from '@/dummy-data-er-fix/document';

export const QUOTATION_CSV_COLUMNS: Omit<
  CsvColumnConfig<DocumentQuotationDataInterface>,
  'enabled'
>[] = [
  { key: 'quotation_number', label: '見積書番号' },
  { key: 'directory_name', label: 'プロジェクト名' },
  { key: 'customer_name', label: '顧客名' },
  { key: 'company_name', label: '会社名' },
  { key: 'expiration_date', label: '有効期限' },
  { key: 'version', label: 'バージョン' },
  { key: 'created_by_name', label: '作成者' },
  { key: 'updated_by_name', label: '更新者' },
  { key: 'remarks', label: '備考' },
  { key: 'created_at', label: '作成日時' },
  { key: 'updated_at', label: '最終更新日時' },
];
