import type { SearchConfig } from '@/shared';
import { DocumentQuotationDataInterface } from '@/dummy-data-er-fix/document';

export const QUOTATION_SEARCHBAR_CONFIG: SearchConfig<DocumentQuotationDataInterface> = {
  searchableFields: [
    'quotation_number',
    'directory_name',
    'customer_name',
    'company_name',
    'remarks',
  ],
};
