export interface Specification {
  id: number;
  company_id: number;
  name: string;
  project_name: string;
  blueprint_name: string;
  version: string;
  approval_status: string;
  created_at: string;
  updated_at: string;
}

export interface SpecificationColumnCallbacks {
  onDelete?: (specification: Specification) => void;
}