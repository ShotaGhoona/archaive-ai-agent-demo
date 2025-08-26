export interface Invoice {
  id: number;
  company_id: number;
  name: string;
  project_name: string;
  billing_destination: string;
  billing_amount: number;
  billing_date: string;
  payment_due_date: string;
  payment_status: string;
  created_at: string;
  updated_at: string;
}

export interface InvoiceColumnCallbacks {
  onDelete?: (invoice: Invoice) => void;
}