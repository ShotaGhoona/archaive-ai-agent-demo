import type { SearchConfig } from "@/shared";
import type { Project } from "../lib";

export const PROJECT_SEARCHBAR_CONFIG: SearchConfig<Project> = {
  searchableFields: ['projectId', 'customerName', 'assignee', 'projectStatus', 'quotationStatus', 'deliveryStatus'],
};