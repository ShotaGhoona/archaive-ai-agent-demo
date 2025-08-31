import { CsvColumnConfig } from '@/shared';
import { DocumentInvoiceDataInterface } from '@/dummy-data-er-fix/document';

export const INVOICE_CSV_COLUMNS: Omit<
  CsvColumnConfig<DocumentInvoiceDataInterface>,
  'enabled'
>[] = [
  { key: 'directory_document_custom_items.請求書番号.value', label: '請求書番号' },
  { key: 'directory_name', label: 'プロジェクト名' },
  { key: 'customer_name', label: '顧客名' },
  { key: 'directory_document_custom_items.請求日.value', label: '請求日' },
  { key: 'directory_document_custom_items.支払条件.value', label: '支払条件' },
  { key: 'directory_document_custom_items.請求金額.value', label: '請求金額' },
  { key: 'name', label: 'ドキュメント名' },
  { key: 'version', label: 'バージョン' },
  { key: 'created_by_name', label: '作成者' },
  { key: 'updated_by_name', label: '更新者' },
  { key: 'remarks', label: '備考' },
  { key: 'created_at', label: '作成日時' },
  { key: 'updated_at', label: '最終更新日時' },
];
