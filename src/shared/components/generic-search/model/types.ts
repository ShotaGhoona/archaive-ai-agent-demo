export interface SearchConfig<T> {
  searchableFields: (keyof T | string)[];
  basicFilter?: {
    filterKey: keyof T | string;
    filterOptions: string[];
    defaultOption: string;
  };
}

export interface UseSearchbarReturn<T> {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedFilter: string;
  setSelectedFilter: (value: string) => void;
  filteredData: T[];
}
