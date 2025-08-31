import { CsvColumnConfig } from '@/shared';
import { DocumentSpecificationDataInterface } from '@/dummy-data-er-fix/document';

export const SPECIFICATION_CSV_COLUMNS: Omit<
  CsvColumnConfig<DocumentSpecificationDataInterface>,
  'enabled'
>[] = [
  { key: 'leaf_product_document_custom_items.仕様書番号.value', label: '仕様書番号' },
  { key: 'leaf_product_name', label: '製品名' },
  { key: 'customer_name', label: '顧客名' },
  { key: 'leaf_product_document_custom_items.承認日.value', label: '承認日' },
  { key: 'leaf_product_document_custom_items.仕様分類.value', label: '仕様分類' },
  { key: 'leaf_product_document_custom_items.適用規格.value', label: '適用規格' },
  { key: 'name', label: 'ドキュメント名' },
  { key: 'version', label: 'バージョン' },
  { key: 'created_by_name', label: '作成者' },
  { key: 'updated_by_name', label: '更新者' },
  { key: 'remarks', label: '備考' },
  { key: 'created_at', label: '作成日時' },
  { key: 'updated_at', label: '最終更新日時' },
];
