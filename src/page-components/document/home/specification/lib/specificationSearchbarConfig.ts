import { SearchConfig } from '@/shared';
import { Specification } from '../model';

export const SPECIFICATION_SEARCHBAR_CONFIG: SearchConfig<Specification> = {
  searchableFields: ['name', 'project_name', 'blueprint_name', 'version']
};