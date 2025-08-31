export interface CustomItemValue {
  value: string;
  color?: string;
  type: string;
}


export interface DrawingPageBaseDataInterface {
  id: number;
  ulid: string;
  drawing_file_id: number;
  drawing_number: string;
  external_drawing_number: string | null;
  drawing_category_rename_id: number;
  page_number: number;
  is_shown_similar_search: boolean;
  s3_url: string;
  remarks: string | null;
  created_by: number;
  updated_by: number;
  created_at: string;
  updated_at: string;
  
  drawing_file_name: string;
  drawing_file_extension: string;
  leaf_product_id: number;
  leaf_product_name: string;
  leaf_product_revision_number: number;
  customer_id: number;
  customer_name: string;
  company_id: number;
  company_name: string;
  drawing_category_name: string;
  created_by_name: string;
  updated_by_name: string;
  
  drawing_page_custom_items?: Record<string, CustomItemValue>;
}

export interface BlueprintDetailDataInterface extends DrawingPageBaseDataInterface {
  similar_blueprints?: DrawingPageBaseDataInterface[];
  estimate_information?: {
    materialCost?: string;
    processingCost?: string;
    setupCost?: string;
    otherCost?: string;
    totalCost?: string;
  };
}

export interface LeafProductDataInterface {
  id: number;
  ulid: string;
  directory_id: number;
  directory_name: string;
  customer_name: string;
  revision_number: number;
  leaf_product_custom_items: Record<string, CustomItemValue>;
  is_latest: boolean;
  remarks: string;
  created_by: number;
  updated_by: number;
  created_at: string;
  updated_at: string;
}