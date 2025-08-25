import { BasicInformation } from "@/widgets";

export interface BasicInformationField {
  label: string;
  key: keyof BasicInformation;
  readOnly?: boolean;
}

export interface BasicInformationFormProps {
  initialData?: Partial<BasicInformation>;
  onSave?: (data: Partial<BasicInformation>) => void;
  className?: string;
}