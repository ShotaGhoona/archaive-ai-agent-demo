import { DocumentSpecificationDataInterface } from '@/dummy-data-er-fix/document';

export interface SpecificationColumnCallbacks {
  onDelete?: (specification: DocumentSpecificationDataInterface) => void;
}
