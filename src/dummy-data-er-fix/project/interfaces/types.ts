import { BlueprintDetailDataInterface } from '@/dummy-data-er-fix/blueprint/interfaces/types';

export interface CustomItemValue {
  value: string;
  color?: string;
  type: string;
}

export interface DirectoryBaseDataInterface {
  id: number;
  ulid: string;
  company_name: string;
  directory_type_name: string;
  customer_name: string;
  name: string;
  directory_custom_items?: Record<string, CustomItemValue>;
  remarks: string;
  created_by_name: string;
  updated_by_name: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectDetailDataInterface {
  project: DirectoryBaseDataInterface;
  blueprints: BlueprintDetailDataInterface[];
}