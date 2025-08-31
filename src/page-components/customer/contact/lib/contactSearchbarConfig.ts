import type { SearchConfig } from '@/shared';
import type { CustomerContactDataInterface } from '@/dummy-data-er-fix/customer';

export const CONTACT_SEARCHBAR_CONFIG: SearchConfig<CustomerContactDataInterface> = {
  searchableFields: [
    'last_name',
    'first_name',
    'email_primary',
    'email_secondary',
    'customer_contact_custom_items.役職.value',
    'customer_contact_custom_items.部署.value',
  ],
};
