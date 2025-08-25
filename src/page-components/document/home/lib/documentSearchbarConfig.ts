import { SearchConfig } from '@/shared';
import { Quotation, Order, Delivery, Invoice, Specification, Inspection } from '../model';

export const QUOTATION_SEARCHBAR_CONFIG: SearchConfig<Quotation> = {
  searchKeys: ['name', 'project_name', 'customer_name'],
  filters: [
    { key: 'name', label: '帳票名' },
    { key: 'project_name', label: '案件名' },
    { key: 'customer_name', label: '顧客名' },
  ]
};

export const ORDER_SEARCHBAR_CONFIG: SearchConfig<Order> = {
  searchKeys: ['name', 'project_name', 'supplier_name'],
  filters: [
    { key: 'name', label: '帳票名' },
    { key: 'project_name', label: '案件名' },
    { key: 'supplier_name', label: '発注先' },
  ]
};

export const DELIVERY_SEARCHBAR_CONFIG: SearchConfig<Delivery> = {
  searchKeys: ['name', 'project_name', 'delivery_destination'],
  filters: [
    { key: 'name', label: '帳票名' },
    { key: 'project_name', label: '案件名' },
    { key: 'delivery_destination', label: '納品先' },
  ]
};

export const INVOICE_SEARCHBAR_CONFIG: SearchConfig<Invoice> = {
  searchKeys: ['name', 'project_name', 'billing_destination'],
  filters: [
    { key: 'name', label: '帳票名' },
    { key: 'project_name', label: '案件名' },
    { key: 'billing_destination', label: '請求先' },
  ]
};

export const SPECIFICATION_SEARCHBAR_CONFIG: SearchConfig<Specification> = {
  searchKeys: ['name', 'project_name', 'blueprint_name'],
  filters: [
    { key: 'name', label: '帳票名' },
    { key: 'project_name', label: '案件名' },
    { key: 'blueprint_name', label: '図面名' },
  ]
};

export const INSPECTION_SEARCHBAR_CONFIG: SearchConfig<Inspection> = {
  searchKeys: ['name', 'project_name'],
  filters: [
    { key: 'name', label: '帳票名' },
    { key: 'project_name', label: '案件名' },
  ]
};