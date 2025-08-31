export interface QuotationFormTableRow {
  id: string;
  productName: string;
  unitPrice: string;
  quantity: string;
  unit: string;
  taxRate: string;
  detail: string;
}

export interface EstimateInformation {
  materialCost?: string;
  processingCost?: string;
  setupCost?: string;
  otherCost?: string;
  totalCost?: string;
}

export interface QuotationFormData {
  clientName: string;
  honorific: string;
  quotationNumber: string;
  issueDate: string;
  validUntil: string;
  tableRows: QuotationFormTableRow[];
  remarks: string;
  companyInfo: {
    name: string;
    phone: string;
    address: string;
    logo?: string;
    stamp?: string;
  };
}
