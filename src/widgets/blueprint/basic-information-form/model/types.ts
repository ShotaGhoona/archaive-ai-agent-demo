import { BlueprintDetailDataInterface } from '@/dummy-data-er-fix/blueprint/interfaces/types';
import { PanelColumnConfig } from '../lib/blueprintBasicInformationConfig';

export interface BlueprintDetailFormProps {
  blueprintData?: BlueprintDetailDataInterface;
  onSave?: (data: Partial<BlueprintDetailDataInterface>) => void;
  className?: string;
}

// export interface BlueprintDetailFormField extends PanelColumnConfig {
//   value?: any;
// }

export type BlueprintDetailFormData = Partial<BlueprintDetailDataInterface>;