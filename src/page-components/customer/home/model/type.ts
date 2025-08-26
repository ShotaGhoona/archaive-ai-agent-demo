export interface Customer {
  id: number;
  company_id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface CustomerColumnCallbacks {
  onEdit?: (customer: Customer) => void;
  onDelete?: (customer: Customer) => void;
}