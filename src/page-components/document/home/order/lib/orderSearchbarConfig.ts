import type { SearchConfig } from "@/shared";
import type { Order } from "../model";

export const ORDER_SEARCHBAR_CONFIG: SearchConfig<Order> = {
  searchableFields: ['name', 'project_name', 'supplier_name'],
};