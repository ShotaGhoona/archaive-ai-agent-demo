import { CsvColumnConfig } from '@/shared';
import { DocumentOrderDataInterface } from '@/dummy-data-er-fix/document';

export const ORDER_CSV_COLUMNS: Omit<
  CsvColumnConfig<DocumentOrderDataInterface>,
  'enabled'
>[] = [
  { key: 'directory_document_custom_items.受注番号.value', label: '受注番号' },
  { key: 'directory_name', label: 'プロジェクト名' },
  { key: 'customer_name', label: '顧客名' },
  { key: 'directory_document_custom_items.受注日.value', label: '受注日' },
  { key: 'directory_document_custom_items.発注区分.value', label: '発注区分' },
  { key: 'directory_document_custom_items.納期条件.value', label: '納期条件' },
  { key: 'name', label: 'ドキュメント名' },
  { key: 'version', label: 'バージョン' },
  { key: 'created_by_name', label: '作成者' },
  { key: 'updated_by_name', label: '更新者' },
  { key: 'remarks', label: '備考' },
  { key: 'created_at', label: '作成日時' },
  { key: 'updated_at', label: '最終更新日時' },
];
