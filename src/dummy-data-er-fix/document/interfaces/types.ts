export interface BlueprintCustomItemValue {
  value: string;
  color?: string;
  type: string;
}

export interface DocumentSpecificationDataInterface {
  id: number;
  ulid: string;
  leaf_product_name: string;
  customer_name: string;
  version: number;
  leaf_product_document_custom_items?: Record<string, BlueprintCustomItemValue>;
  name: string;
  s3_url: string;
  remarks?: string;
  created_by_name: string;
  updated_by_name: string;
  created_at: string;
  updated_at: string;
}

export interface DocumentDeliveryDataInterface {
  id: number;
  ulid: string;
  directory_name: string;
  customer_name: string;
  version: number;
  directory_document_custom_items?: Record<string, BlueprintCustomItemValue>;
  name: string;
  s3_url: string;
  remarks?: string;
  created_by_name: string;
  updated_by_name: string;
  created_at: string;
  updated_at: string;
}

export interface DocumentInvoiceDataInterface {
  id: number;
  ulid: string;
  directory_name: string;
  customer_name: string;
  version: number;
  directory_document_custom_items?: Record<string, BlueprintCustomItemValue>;
  name: string;
  s3_url: string;
  remarks?: string;
  created_by_name: string;
  updated_by_name: string;
  created_at: string;
  updated_at: string;
}

export interface DocumentOrderDataInterface {
  id: number;
  ulid: string;
  directory_name: string;
  customer_name: string;
  version: number;
  directory_document_custom_items?: Record<string, BlueprintCustomItemValue>;
  name: string;
  s3_url: string;
  remarks?: string;
  created_by_name: string;
  updated_by_name: string;
  created_at: string;
  updated_at: string;
}

export interface DocumentQuotationDataInterface {
  id: number;
  directory_name: string;
  customer_name: string;
  company_name: string;
  quotation_number: string;
  expiration_date: string;
  version: number;
  s3_url: string;
  remarks?: string;
  created_by_name: string;
  updated_by_name: string;
  created_at: string;
  updated_at: string;
}

export interface DocumentShippingDataInterface {
  id: number;
  ulid: string;
  directory_name: string;
  customer_name: string;
  version: number;
  directory_document_custom_items?: Record<string, BlueprintCustomItemValue>;
  name: string;
  s3_url: string;
  remarks?: string;
  created_by_name: string;
  updated_by_name: string;
  created_at: string;
  updated_at: string;
}