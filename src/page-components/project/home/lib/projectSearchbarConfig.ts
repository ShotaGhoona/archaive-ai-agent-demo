import type { SearchConfig } from "@/shared/GenericSearch";
import type { Project } from "./projectColumns";

export const PROJECT_SEARCHBAR_CONFIG: SearchConfig<Project> = {
  searchableFields: ['projectId', 'customerName', 'assignee', 'projectStatus', 'quotationStatus', 'deliveryStatus'],
};