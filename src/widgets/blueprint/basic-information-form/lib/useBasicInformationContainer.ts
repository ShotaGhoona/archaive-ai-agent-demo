'use client';
import { useState, useEffect } from 'react';
import { BlueprintDetailDataInterface } from '@/dummy-data-er-fix/blueprint/interfaces/types';
import { BlueprintDetailFormData } from '../model/types';
import { getValue, setValue } from '@/shared/utility/object-path/object-path';

export function useBasicInformationContainer(
  initialData?: BlueprintDetailDataInterface,
) {
  const [formData, setFormData] = useState<BlueprintDetailFormData>(
    initialData || {},
  );
  const [isModified, setIsModified] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setIsModified(false);
    }
  }, [initialData]);

  const handleInputChange = (field: keyof BlueprintDetailDataInterface | string, value: any) => {
    setFormData((prev) => {
      const newData = { ...prev };
      setValue(newData as Record<string, unknown>, field as string, value);
      return newData as BlueprintDetailFormData;
    });
    setIsModified(true);
  };

  const handleSave = (onSave?: (data: BlueprintDetailFormData) => void) => {
    setIsModified(false);
    if (onSave) {
      onSave(formData);
    } else {
      console.log('Blueprint詳細情報保存:', formData);
    }
  };

  const resetForm = () => {
    if (initialData) {
      setFormData(initialData);
      setIsModified(false);
    }
  };

  return {
    formData,
    isModified,
    handleInputChange,
    handleSave,
    resetForm,
  };
}