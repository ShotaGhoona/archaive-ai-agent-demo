import type { SearchConfig } from "@/shared";
import type { Contact } from "../model";

export const CONTACT_SEARCHBAR_CONFIG: SearchConfig<Contact> = {
  searchableFields: ['last_name', 'first_name', 'email_primary', 'email_secondary', 'title', 'department'],
};