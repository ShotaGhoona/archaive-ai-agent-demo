import { SearchConfig } from '@/shared';
import { Delivery } from '../model';

export const DELIVERY_SEARCHBAR_CONFIG: SearchConfig<Delivery> = {
  searchableFields: ['name', 'project_name', 'delivery_destination']
};