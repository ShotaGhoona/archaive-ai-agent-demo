export interface CustomerCustomItemValue {
  value: string;
  color?: string;
  type: string;
}

export interface CustomerHomeDataInterface {
  id: number;
  company_id: number;
  seq_num: number;
  name: string;
  name_kana?: string;
  customer_custom_items?: Record<string, CustomerCustomItemValue>;
  customer_status: string;
  annual_revenue?: number;
  head_count?: number;
  website?: string;
  remarks?: string;
  in_charge_name: string;
  created_by_name: string;
  created_at: string;
  updated_at: string;
}

export interface CustomerContactDataInterface {
  id: number;
  customer_id: number;
  last_name: string;
  first_name: string;
  last_name_kana?: string;
  first_name_kana?: string;
  customer_contact_custom_items?: Record<string, CustomerCustomItemValue>;
  phone_number?: string;
  office_phone_number?: string;
  email_primary?: string;
  email_secondary?: string | null;
  fax?: string;
  remarks?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

