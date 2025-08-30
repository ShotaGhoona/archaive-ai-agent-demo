import { CustomerHomeDataInterface } from "@/dummy-data/customer";

export interface CustomerColumnCallbacks {
  onEdit?: (customer: CustomerHomeDataInterface) => void;
  onDelete?: (customer: CustomerHomeDataInterface) => void;
}