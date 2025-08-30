import type { CustomerContactDataInterface } from "@/dummy-data/customer";

// UI関連の型定義のみここに残す
export interface ContactColumnCallbacks {
  onEdit?: (contact: CustomerContactDataInterface) => void;
  onDelete?: (contact: CustomerContactDataInterface) => void;
}