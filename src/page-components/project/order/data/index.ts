import orderJsonData from './order.json';
import { OrderData } from '../model';

export const orderData: OrderData[] = orderJsonData as OrderData[];

// ヘルパー関数　本当はバックの処理 です
export const getOrderById = (id: string): OrderData | undefined => {
  return orderData.find(o => o.order_id === id);
};

export const getOrdersByProject = (projectId: string): OrderData[] => {
  return orderData.filter(o => o.project_id === projectId);
};

export const getOrdersByCustomer = (customerId: string): OrderData[] => {
  return orderData.filter(o => o.customer_id === customerId);
};