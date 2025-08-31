import type { SearchConfig } from '@/shared';
import type { DocumentOrderDataInterface } from '@/dummy-data-er-fix/document';

export const ORDER_SEARCHBAR_CONFIG: SearchConfig<DocumentOrderDataInterface> = {
  searchableFields: [
    'directory_document_custom_items.受注番号.value',
    'directory_name',
    'customer_name',
    'directory_document_custom_items.発注区分.value',
    'directory_document_custom_items.納期条件.value',
    'name',
  ],
};
