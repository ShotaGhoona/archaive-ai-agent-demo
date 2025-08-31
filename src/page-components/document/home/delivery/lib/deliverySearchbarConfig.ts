import type { SearchConfig } from '@/shared';
import type { DocumentDeliveryDataInterface } from '@/dummy-data-er-fix/document';

export const DELIVERY_SEARCHBAR_CONFIG: SearchConfig<DocumentDeliveryDataInterface> = {
  searchableFields: [
    'directory_document_custom_items.納品書番号.value',
    'directory_name',
    'customer_name',
    'directory_document_custom_items.納品先.value',
    'directory_document_custom_items.品目・数量.value',
    'name',
  ],
};
