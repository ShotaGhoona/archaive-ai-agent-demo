import { useState, useEffect } from "react";
import { BasicInformation } from "@/widgets";

export function useBasicInformationForm(initialData?: Partial<BasicInformation>) {
  const [formData, setFormData] = useState<Partial<BasicInformation>>(initialData || {});
  const [isModified, setIsModified] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setIsModified(false);
    }
  }, [initialData]);

  const handleInputChange = (field: keyof BasicInformation, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setIsModified(true);
  };

  const handleSave = (onSave?: (data: Partial<BasicInformation>) => void) => {
    setIsModified(false);
    if (onSave) {
      onSave(formData);
    } else {
      console.log("基本情報保存:", formData);
    }
  };

  return {
    formData,
    isModified,
    handleInputChange,
    handleSave
  };
}