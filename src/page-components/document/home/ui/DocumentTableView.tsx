"use client";
import { ConfigBasedTableView } from "@/shared";
import { DocumentTableViewProps } from '../model';
import { 
  createQuotationTableConfig,
  createOrderTableConfig,
  createDeliveryTableConfig,
  createInvoiceTableConfig,
  createSpecificationTableConfig,
  createInspectionTableConfig
} from '../lib';

export function DocumentTableView({ 
  documents,
  selectedType
}: DocumentTableViewProps) {
  const getTableConfig = () => {
    switch (selectedType) {
      case 'quotation':
        return createQuotationTableConfig();
      case 'order':
        return createOrderTableConfig();
      case 'delivery':
        return createDeliveryTableConfig();
      case 'invoice':
        return createInvoiceTableConfig();
      case 'specification':
        return createSpecificationTableConfig();
      case 'inspection':
        return createInspectionTableConfig();
      default:
        return createQuotationTableConfig();
    }
  };

  return (
    <ConfigBasedTableView
      data={documents as any}
      config={getTableConfig()}
      getRowId={(document: any) => document.id.toString()}
    />
  );
}