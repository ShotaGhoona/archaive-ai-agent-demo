import { SearchConfig } from '@/shared';
import { Invoice } from '../model';

export const INVOICE_SEARCHBAR_CONFIG: SearchConfig<Invoice> = {
  searchableFields: ['name', 'project_name', 'billing_destination']
};