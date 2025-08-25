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

export interface Specification {
  id: number;
  company_id: number;
  name: string;
  project_name: string;
  blueprint_name: string;
  version: string;
  approval_status: string;
  created_at: string;
  updated_at: string;
}

export interface Inspection {
  id: number;
  company_id: number;
  name: string;
  project_name: string;
  inspection_items_count: number;
  inspection_date: string;
  inspection_result: string;
  approval_status: string;
  created_at: string;
  updated_at: string;
}

export type DocumentType = 'quotation' | 'order' | 'delivery' | 'invoice' | 'specification' | 'inspection';

export type DocumentData = Quotation | Order | Delivery | Invoice | Specification | Inspection;

export interface DocumentTypeHeaderProps {
  selectedType: DocumentType;
  onTypeChange: (type: DocumentType) => void;
}

export interface DocumentPageHeaderProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  onToggleFilterSidebar: () => void;
  isFilterSidebarOpen: boolean;
  documents: unknown[];
  selectedType: DocumentType;
}

export interface DocumentTableViewProps {
  documents: unknown[];
  selectedType: DocumentType;
}