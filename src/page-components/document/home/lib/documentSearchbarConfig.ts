import { SearchConfig } from '@/shared';
import { Quotation, Order, Delivery, Invoice, Specification, Inspection } from '../model';

export const QUOTATION_SEARCHBAR_CONFIG: SearchConfig<Quotation> = {
  searchableFields: ['name', 'project_name', 'customer_name'],
};

export const ORDER_SEARCHBAR_CONFIG: SearchConfig<Order> = {
  searchableFields: ['name', 'project_name', 'supplier_name'],
};

export const DELIVERY_SEARCHBAR_CONFIG: SearchConfig<Delivery> = {
  searchableFields: ['name', 'project_name', 'delivery_destination'],
};

export const INVOICE_SEARCHBAR_CONFIG: SearchConfig<Invoice> = {
  searchableFields: ['name', 'project_name', 'billing_destination'],
};

export const SPECIFICATION_SEARCHBAR_CONFIG: SearchConfig<Specification> = {
  searchableFields: ['name', 'project_name', 'blueprint_name'],
};

export const INSPECTION_SEARCHBAR_CONFIG: SearchConfig<Inspection> = {
  searchableFields: ['name', 'project_name'],
};