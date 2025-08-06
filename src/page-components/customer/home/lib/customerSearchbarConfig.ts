import type { SearchConfig } from "@/shared/GenericSearch";
import type { Customer } from "./customerColumns";

export const CUSTOMER_SEARCHBAR_CONFIG: SearchConfig<Customer> = {
  searchableFields: ['customerCode', 'customerName', 'contactPerson', 'salesRepresentative', 'industry'],
};