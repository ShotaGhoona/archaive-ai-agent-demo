import type { SearchConfig } from "@/shared";
import type { Quotation } from "../model";

export const QUOTATION_SEARCHBAR_CONFIG: SearchConfig<Quotation> = {
  searchableFields: ['name', 'project_name', 'customer_name'],
};