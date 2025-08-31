import { SearchConfig } from '@/shared';
import { DocumentSpecificationDataInterface } from '@/dummy-data-er-fix/document';

export const SPECIFICATION_SEARCHBAR_CONFIG: SearchConfig<DocumentSpecificationDataInterface> = {
  searchableFields: [
    'leaf_product_document_custom_items.仕様書番号.value',
    'leaf_product_name',
    'customer_name',
    'leaf_product_document_custom_items.仕様分類.value',
    'leaf_product_document_custom_items.適用規格.value',
    'name',
  ],
};
