export interface Customer {
  id: number;
  company_id: number;
  account_id: string;
  account_name: string;
  account_name_kana?: string;
  account_type: string;
  status: string;
  annual_revenue?: number;
  employee_count?: number;
  website?: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface CustomerColumnCallbacks {
  onEdit?: (customer: Customer) => void;
  onDelete?: (customer: Customer) => void;
}