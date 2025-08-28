export interface TableRow {
  id: string;
  productName: string;
  unitPrice: string;
  quantity: string;
  unit: string;
  taxRate: string;
  detail: string;
}

export interface EstimateData {
  materialCost: string;
  processingCost: string;
  totalCost: string;
}

export interface FormData {
  clientName: string;
  honorific: string;
  quotationNumber: string;
  issueDate: string;
  validUntil: string;
  tableRows: TableRow[];
  remarks: string;
  companyInfo: {
    name: string;
    phone: string;
    address: string;
    logo?: string;
    stamp?: string;
  };
}
export interface QuotationCreateBlueprint {
  id: string;
  name: string;
  description: string;
  size: number;
  type: string;
  imageUrl: string;
  createdAt: string;
  isActive: boolean;
  basicInformation: {
    fileName: string;
    pageNumber: string;
    customerName: string;
    productName: string;
    internalProductNumber: string;
    customerProductNumber: string;
    cadName: string;
    camName: string;
    orderQuantity: string;
    orderDate: string;
    deliveryDate: string;
    maxLength: string;
    maxWidth: string;
    maxHeight: string;
    test: string;
    companyItem: string;
    itemG: string;
    itemI: string;
    remarks: string;
  };
  estimateInformation: {
    materialCost: string;
    processingCost: string;
    laborCost: string;
    equipmentCost: string;
    overheadCost: string;
    profitMargin: string;
    totalCost: string;
    unitPrice: string;
    totalPrice: string;
    deliveryDays: string;
    setupCost: string;
    transportCost: string;
    packagingCost: string;
    qualityAssuranceCost: string;
    remarks: string;
  };
  similarBlueprints: Array<{
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    similarity: number;
    createdAt: string;
    basicInformation: QuotationCreateBlueprint['basicInformation'];
    estimateInformation: QuotationCreateBlueprint['estimateInformation'];
  }>;
}
