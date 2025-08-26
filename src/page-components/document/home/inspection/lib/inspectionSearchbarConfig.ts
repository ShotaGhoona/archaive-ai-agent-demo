import { SearchConfig } from '@/shared';
import { Inspection } from '../model';

export const INSPECTION_SEARCHBAR_CONFIG: SearchConfig<Inspection> = {
  searchableFields: ['name', 'project_name']
};