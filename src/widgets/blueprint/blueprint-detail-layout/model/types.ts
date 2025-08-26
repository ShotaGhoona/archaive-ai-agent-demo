export interface BasicInformation {
  fileName?: string;
  pageNumber?: string;
  customerName?: string;
  productName?: string;
  internalProductNumber?: string;
  customerProductNumber?: string;
  cadName?: string;
  camName?: string;
  orderQuantity?: string;
  orderDate?: string;
  deliveryDate?: string;
  maxLength?: string;
  maxWidth?: string;
  maxHeight?: string;
  test?: string;
  companyItem?: string;
  itemG?: string;
  itemI?: string;
  remarks?: string;
}

export interface EstimateInformation {
  materialCost?: string;
  processingCost?: string;
  laborCost?: string;
  equipmentCost?: string;
  overheadCost?: string;
  profitMargin?: string;
  totalCost?: string;
  unitPrice?: string;
  totalPrice?: string;
  deliveryDays?: string;
  setupCost?: string;
  transportCost?: string;
  packagingCost?: string;
  qualityAssuranceCost?: string;
  remarks?: string;
}

export interface SimilarBlueprint {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  similarity: number;
  createdAt: string;
  basicInformation?: BasicInformation;
  estimateInformation?: EstimateInformation;
}

export interface BlueprintFile {
  id: string;
  name: string;
  description: string;
  size: number;
  type: string;
  imageUrl: string;
  createdAt: string;
  isActive?: boolean;
  basicInformation?: BasicInformation;
  estimateInformation?: EstimateInformation;
  similarBlueprints?: SimilarBlueprint[];
}