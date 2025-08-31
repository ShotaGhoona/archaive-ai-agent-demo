import { SearchConfig } from '@/shared';
import { DocumentInvoiceDataInterface } from '@/dummy-data-er-fix/document';

export const INVOICE_SEARCHBAR_CONFIG: SearchConfig<DocumentInvoiceDataInterface> = {
  searchableFields: [
    'directory_document_custom_items.請求書番号.value',
    'directory_name',
    'customer_name',
    'directory_document_custom_items.支払条件.value',
    'directory_document_custom_items.請求金額.value',
    'name',
  ],
};
