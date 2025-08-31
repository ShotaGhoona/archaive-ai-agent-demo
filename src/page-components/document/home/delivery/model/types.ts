import { DocumentDeliveryDataInterface } from '@/dummy-data-er-fix/document';

export interface DeliveryColumnCallbacks {
  onDelete?: (delivery: DocumentDeliveryDataInterface) => void;
}
