// これ後で消さないと、、
export interface SimilarBlueprint {
  id: string;
  name: string;
  imageUrl: string;
  similarity: number;
  partNumber?: string;
  material?: string;
  customer?: string;
  description?: string;
  createdAt?: string;
  basicInformation?: {
    fileName?: string;
    customerName?: string;
    productName?: string;
    internalProductNumber?: string;
    customerProductNumber?: string;
    [key: string]: unknown;
  };
  estimateInformation?: {
    [key: string]: unknown;
  };
}

export interface BlueprintView {
  id: string;
  name: string;
  fileName: string;
  description: string;
  viewType: string;
  imageUrl: string;
  fileType: string;
  uploadDate: string;
  isActive: boolean;
  createdAt: string;
  similarBlueprints: SimilarBlueprint[];
}

export interface BasicInformation {
  id?: string;
  name?: string;
  partNumber?: string;
  version?: string;
  material?: string;
  thickness?: string;
  weight?: string;
  customer?: string;
  projectCode?: string;
  designer?: string;
  checker?: string;
  approver?: string;
  drawingDate?: string;
  lastModified?: string;
  status?: string;
  category?: string;
  subcategory?: string;
  [key: string]: unknown;
}