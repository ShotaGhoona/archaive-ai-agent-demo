export interface Delivery {
  id: number;
  company_id: number;
  name: string;
  project_name: string;
  delivery_destination: string;
  delivery_date: string;
  inspection_scheduled_date: string;
  inspection_status: string;
  created_at: string;
  updated_at: string;
}

export interface DeliveryColumnCallbacks {
  onDelete?: (delivery: Delivery) => void;
}