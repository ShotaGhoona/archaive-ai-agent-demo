import type { SearchConfig } from "@/shared";
import type { Contact } from "../lib";

export const CONTACT_SEARCHBAR_CONFIG: SearchConfig<Contact> = {
  searchableFields: ['name', 'email'],
};