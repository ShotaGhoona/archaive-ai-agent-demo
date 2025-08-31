import { DocumentQuotationDataInterface } from '@/dummy-data-er-fix/document';

export interface QuotationColumnCallbacks {
  onDelete?: (quotation: DocumentQuotationDataInterface) => void;
}
