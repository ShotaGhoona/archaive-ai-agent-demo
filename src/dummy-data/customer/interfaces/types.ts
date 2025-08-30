export interface CustomerHomeDataInterface {
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

export interface CustomerContactDataInterface {
  contact_id: string;
  customer_id: number;
  last_name: string;
  first_name: string;
  last_name_kana?: string;
  first_name_kana?: string;
  title?: string;
  department?: string;
  email_primary?: string;
  email_secondary?: string;
  phone_office?: string;
  phone_mobile?: string;
  fax?: string;
  owner_user_id: string;
  description?: string;
  status: boolean;
  created_date: string;
  created_by: string;
  modified_date: string;
  modified_by: string;
}