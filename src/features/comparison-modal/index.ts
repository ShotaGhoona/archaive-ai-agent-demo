// Public API for comparison-modal feature

// Types
export type {
  ComparisonData,
  ComparisonFieldConfig,
  ComparisonTabConfig,
  ComparisonConfig,
  ComparisonModalProps,
  ComparisonItem,
  UseComparisonModalReturn,
  ComparisonFieldProps,
} from './model/types';

// Hooks
export { useComparisonModal } from './model/useComparisonModal';

// UI Components
export { ComparisonModal } from './ui/ComparisonModal';
export { 
  EditableComparisonField, 
  ReadOnlyComparisonField 
} from './lib/field-components';

// Utilities
export { 
  DataExtractors, 
  CommonExtractors 
} from './lib/data-extractors';
export { createHighlightedTextElements } from './lib/text-diff-highlighter';