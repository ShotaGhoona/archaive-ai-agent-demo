import { CustomerHomeDataInterface } from '@/dummy-data-er-fix/customer';

export interface CustomerColumnCallbacks {
  onEdit?: (customer: CustomerHomeDataInterface) => void;
  onDelete?: (customer: CustomerHomeDataInterface) => void;
}
