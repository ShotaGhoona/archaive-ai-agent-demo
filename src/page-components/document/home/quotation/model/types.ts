export interface Quotation {
  id: number;
  company_id: number;
  name: string;
  project_name: string;
  customer_name: string;
  amount: number;
  quotation_date: string;
  expiry_date: string;
  approval_status: string;
  created_at: string;
  updated_at: string;
}

export interface QuotationColumnCallbacks {
  onDelete?: (quotation: Quotation) => void;
}