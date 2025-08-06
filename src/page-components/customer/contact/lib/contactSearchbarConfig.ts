import type { SearchConfig } from "@/shared/GenericSearch";
import type { Contact } from "./contactColumns";

export const CONTACT_SEARCHBAR_CONFIG: SearchConfig<Contact> = {
  searchableFields: ['contactName', 'department', 'position', 'contactType'],
};