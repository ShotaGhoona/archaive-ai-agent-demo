export interface BlueprintHomeDataInterface {
  filename: string;
  orderSource: string;
  productName: string;
  internalNumber: string;
  customerNumber: string;
  cadName: string;
  camName: string;
  orderQuantity: number;
  orderDate: string;
  deliveryDate: string;
  maxDimensionL: number;
  maxDimensionD: number;
  maxDimensionH: number;
  companyField: string;
  image: string;
}

export interface BlueprintSpecificationDataInterface {
  specification_id: string;
  product_id: string;
  image_url: string;
  created_date: string;
  created_user_id: string;
  modified_date: string;
  modified_user_id: string;
  remarks: string;
}