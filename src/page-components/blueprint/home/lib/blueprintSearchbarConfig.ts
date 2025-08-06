import type { SearchConfig } from "@/shared/GenericSearch";
import type { Blueprint } from "./blueprintColumns";

export const BLUEPRINT_SEARCHBAR_CONFIG: SearchConfig<Blueprint> = {
  searchableFields: ['filename', 'orderSource', 'productName', 'internalNumber', 'customerNumber'],
  basicFilter: {
    filterKey: 'companyField',
    filterOptions: ['全て', '製造業', 'IT', '建設業'],
    defaultOption: '全て',
  },
};