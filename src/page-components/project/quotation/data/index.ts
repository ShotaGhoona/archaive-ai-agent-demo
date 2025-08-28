import quotationJsonData from './quotation.json';
import { QuotationData } from '../model';

export const quotationData: QuotationData[] = quotationJsonData as QuotationData[];

// ヘルパー関数
export const getQuotationById = (id: string): QuotationData | undefined => {
  return quotationData.find(q => q.quote_id === id);
};

export const getQuotationsByProject = (projectId: string): QuotationData[] => {
  return quotationData.filter(q => q.project_id === projectId);
};

export const getQuotationsByCustomer = (customerId: string): QuotationData[] => {
  return quotationData.filter(q => q.customer_id === customerId);
};