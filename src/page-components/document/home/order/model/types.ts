import { DocumentOrderDataInterface } from '@/dummy-data-er-fix/document';

export interface OrderColumnCallbacks {
  onDelete?: (order: DocumentOrderDataInterface) => void;
}
