import type { SearchConfig } from "@/shared";
import type { Customer } from "../model";

export const CUSTOMER_SEARCHBAR_CONFIG: SearchConfig<Customer> = {
  searchableFields: ['account_id', 'account_name'],
};