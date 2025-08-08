export interface ProjectData {
  projectId: string;
  customerName: string;
  assignee: string;
  responseDeadline: string;
  workCompleteDate: string;
  deliveryDeadline: string;
  receiptDate: string;
  projectStatus: string;
  quotationStatus: string;
  deliveryStatus: string;
  lastUpdatedBy: string;
  lastUpdatedAt: string;
  notes?: string;
}

export interface FieldConfig {
  key: keyof ProjectData;
  label: string;
  type: 'input' | 'select' | 'textarea';
  inputType?: string;
  placeholder: string;
  locked: boolean;
  options?: string[];
  rows?: number;
  spanCol: number;
}

export interface SectionConfig {
  title: string;
  fields: FieldConfig[];
}

export interface ProjectConfig {
  projectData: ProjectData;
  blueprints: any[];
  fieldConfig: SectionConfig[];
}