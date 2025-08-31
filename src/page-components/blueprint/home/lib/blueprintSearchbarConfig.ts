import type { SearchConfig } from '@/shared';
import type { DrawingPageBaseDataInterface } from '@/dummy-data-er-fix/blueprint';

export const BLUEPRINT_SEARCHBAR_CONFIG: SearchConfig<DrawingPageBaseDataInterface> =
  {
    searchableFields: [
      'drawing_file_name',
      'customer_name',
      'leaf_product_name',
      'drawing_number',
      'external_drawing_number',
    ],
    basicFilter: {
      filterKey: 'drawing_category_name',
      filterOptions: ['全て', '本図面', '参考図面', '製品図', '部品図', '組立図'],
      defaultOption: '全て',
    },
  };
