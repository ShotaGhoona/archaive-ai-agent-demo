export interface Order {
  id: number;
  company_id: number;
  name: string;
  project_name: string;
  supplier_name: string;
  order_amount: number;
  order_date: string;
  delivery_date: string;
  approval_status: string;
  created_at: string;
  updated_at: string;
}

export interface OrderColumnCallbacks {
  onDelete?: (order: Order) => void;
}