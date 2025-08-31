import type { SearchConfig } from '@/shared';
import type { DirectoryBaseDataInterface } from '@/dummy-data-er-fix/project';

export const PROJECT_SEARCHBAR_CONFIG: SearchConfig<DirectoryBaseDataInterface> =
  {
    searchableFields: [
      'id',
      'customer_name',
      'name',
      'directory_custom_items.担当者.value',
      'directory_custom_items.案件ステータス.value',
      'directory_custom_items.見積書ステータス.value',
      'directory_custom_items.納品書ステータス.value',
    ],
  };
