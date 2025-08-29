import deliveryJsonData from './delivery.json';
import { DeliveryData } from '../model';

export const deliveryData: DeliveryData[] = deliveryJsonData as DeliveryData[];

// ヘルパー関数　本当はバックの処理 です
export const getDeliveryById = (id: string): DeliveryData | undefined => {
  return deliveryData.find(d => d.delivery_id === id);
};

export const getDeliveriesByProject = (projectId: string): DeliveryData[] => {
  return deliveryData.filter(d => d.project_id === projectId);
};

export const getDeliveriesByAddress = (address: string): DeliveryData[] => {
  return deliveryData.filter(d => d.delivery_address === address);
};