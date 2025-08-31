import { CsvColumnConfig } from '@/shared';
import { DocumentDeliveryDataInterface } from '@/dummy-data-er-fix/document';

export const DELIVERY_CSV_COLUMNS: Omit<
  CsvColumnConfig<DocumentDeliveryDataInterface>,
  'enabled'
>[] = [
  { key: 'directory_document_custom_items.納品書番号.value', label: '納品書番号' },
  { key: 'directory_name', label: 'プロジェクト名' },
  { key: 'customer_name', label: '顧客名' },
  { key: 'directory_document_custom_items.納品先.value', label: '納品先' },
  { key: 'directory_document_custom_items.納品日.value', label: '納品日' },
  { key: 'directory_document_custom_items.品目・数量.value', label: '品目・数量' },
  { key: 'name', label: 'ドキュメント名' },
  { key: 'version', label: 'バージョン' },
  { key: 'created_by_name', label: '作成者' },
  { key: 'updated_by_name', label: '更新者' },
  { key: 'remarks', label: '備考' },
  { key: 'created_at', label: '作成日時' },
  { key: 'updated_at', label: '最終更新日時' },
];
