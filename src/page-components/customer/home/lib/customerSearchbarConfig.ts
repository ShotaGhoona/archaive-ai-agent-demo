import type { SearchConfig } from '@/shared';
import type { CustomerHomeDataInterface } from '@/dummy-data-er-fix/customer';

export const CUSTOMER_SEARCHBAR_CONFIG: SearchConfig<CustomerHomeDataInterface> = {
  searchableFields: [
    'seq_num', 
    'name', 
    'name_kana',
    'customer_custom_items.業界分類.value',
    'customer_custom_items.契約形態.value',
  ],
};
