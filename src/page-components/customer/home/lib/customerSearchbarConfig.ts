import type { SearchConfig } from "@/shared";
import type { Customer } from "../lib";

export const CUSTOMER_SEARCHBAR_CONFIG: SearchConfig<Customer> = {
  searchableFields: ['customerCode', 'customerName', 'contactPerson', 'salesRepresentative', 'industry'],
};