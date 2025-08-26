export interface Inspection {
  id: number;
  company_id: number;
  name: string;
  project_name: string;
  inspection_items_count: number;
  inspection_date: string;
  inspection_result: string;
  approval_status: string;
  created_at: string;
  updated_at: string;
}

export interface InspectionColumnCallbacks {
  onDelete?: (inspection: Inspection) => void;
}