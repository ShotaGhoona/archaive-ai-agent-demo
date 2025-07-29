// Public API for advanced-filter feature

// Types
export type {
  FilterConfig,
  FilterState,
  DateRangeFilter,
  AdvancedFilterProps,
  FilterControlProps,
  FilterToggleButtonProps,
} from './model/types';

// Hooks
export { 
  useAdvancedFilter,
  type UseAdvancedFilterReturn 
} from './model/useAdvancedFilter';

// Utilities
export {
  applyFilters,
  createInitialFilters,
  hasActiveFilters,
} from './model/filterUtils';

// UI Components
export { AdvancedFilterSidebar } from './ui/AdvancedFilterSidebar';
export { FilterToggleButton } from './ui/FilterToggleButton';
export { FilterControl } from './ui/FilterControls';