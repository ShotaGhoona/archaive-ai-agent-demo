export interface Contact {
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