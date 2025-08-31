'use client';

import React, { useState, useCallback } from 'react';
import { Button } from '@/shared';
import { Save } from 'lucide-react';
import { 
  projectBasicInformationConfig,
  PanelColumnConfig,
  FormSection 
} from '../lib/projectBasicInformationFormConfig';
import { getValue, setValue } from '@/shared/utility/object-path';
import {
  BasicInformationTextField,
  BasicInformationNumberField,
  BasicInformationDateField,
  BasicInformationSelectField,
  BasicInformationTextareaField,
} from './components';
import { DirectoryBaseDataInterface, CustomItemValue } from '@/dummy-data-er-fix/project/interfaces/types';

interface ProjectInfoFormProps {
  projectData: DirectoryBaseDataInterface;
  onUpdate: (updatedProject: Partial<DirectoryBaseDataInterface>) => void;
  onSave: () => Promise<void>;
  isLoading: boolean;
}

export function ProjectInfoForm({ 
  projectData, 
  onUpdate, 
  onSave, 
  isLoading 
}: ProjectInfoFormProps) {
  const [formData, setFormData] = useState<DirectoryBaseDataInterface>(projectData);
  const [isModified, setIsModified] = useState(false);

  const handleFieldChange = useCallback((fieldKey: string, value: any) => {
    setFormData(prevData => {
      const newData = { ...prevData };
      setValue(newData, fieldKey, value);
      return newData;
    });
    
    setIsModified(true);
    
    // 親コンポーネントにも更新を通知
    const updatedData = { ...formData };
    setValue(updatedData, fieldKey, value);
    onUpdate(updatedData);
  }, [formData, onUpdate]);

  const handleSave = async () => {
    try {
      await onSave();
      setIsModified(false); // 保存後はリセット
      console.log('Project data saved successfully');
    } catch (error) {
      console.error('Failed to save project data:', error);
    }
  };

  const renderField = (field: PanelColumnConfig, sectionKey: string) => {
    const fieldPath = sectionKey === 'custom' ? `directory_custom_items.${field.key}` : field.key;
    const currentValue = getValue(formData, fieldPath);
    
    // カスタム項目の場合は型安全にアクセス
    const displayValue = sectionKey === 'custom' && currentValue && typeof currentValue === 'object' && 'value' in currentValue
      ? (currentValue as CustomItemValue).value 
      : currentValue;

    const baseOnChange = (value: any) => {
      if (sectionKey === 'custom') {
        const customValue = (currentValue && typeof currentValue === 'object' ? currentValue : {}) as CustomItemValue;
        handleFieldChange(fieldPath, { ...customValue, value });
      } else {
        handleFieldChange(fieldPath, value);
      }
    };

    switch (field.inputType) {
      case 'text':
        return (
          <BasicInformationTextField
            key={field.key}
            value={String(displayValue || '')}
            onChange={baseOnChange}
            disabled={!field.editable}
            required={field.required || false}
          />
        );
      case 'number':
        return (
          <BasicInformationNumberField
            key={field.key}
            value={Number(displayValue || 0)}
            onChange={baseOnChange}
            disabled={!field.editable}
          />
        );
      case 'date':
        return (
          <BasicInformationDateField
            key={field.key}
            value={String(displayValue || '')}
            onChange={baseOnChange}
            disabled={!field.editable}
          />
        );
      case 'select':
        return (
          <BasicInformationSelectField
            key={field.key}
            label={field.label}
            value={String(displayValue || '')}
            onChange={baseOnChange}
            disabled={!field.editable}
            options={field.options || []}
          />
        );
      case 'textarea':
        return (
          <BasicInformationTextareaField
            key={field.key}
            value={String(displayValue || '')}
            onChange={baseOnChange}
            disabled={!field.editable}
          />
        );
      default:
        return (
          <BasicInformationTextField
            key={field.key}
            value={String(displayValue || '')}
            onChange={baseOnChange}
            disabled={!field.editable}
            required={field.required || false}
          />
        );
    }
  };

  // カスタム項目のフィールド設定を動的生成
  const getCustomFields = (): PanelColumnConfig[] => {
    if (!formData.directory_custom_items) return [];
    
    return Object.entries(formData.directory_custom_items).map(([key, item]) => {
      const customItem = item as CustomItemValue;
      return {
        key,
        label: key,
        inputType: customItem.type === 'select' ? 'select' : 
                  customItem.type === 'number' ? 'number' :
                  customItem.type === 'date' ? 'date' : 'text',
        editable: true,
        required: false,
        options: customItem.type === 'select' ? [
          { label: customItem.value, value: customItem.value }
        ] : undefined,
      };
    });
  };


  return (
    <div className='flex h-full flex-col'>
      <div className='flex-1 overflow-y-auto p-4'>
        <div className="space-y-6">
          {/* 基本情報セクション */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-primary">基本情報</h3>
            <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
              {projectBasicInformationConfig[0].fields.map(field => (
                <div key={field.key} className={`space-y-2 ${field.inputType === 'textarea' ? 'lg:col-span-2' : ''}`}>
                  <label className='text-sm font-medium text-gray-700'>
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  {renderField(field, 'basic')}
                </div>
              ))}
            </div>
          </div>

          {/* カスタム項目セクション */}
          {getCustomFields().length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-primary">カスタム項目</h3>
              <div className='grid grid-cols-1 gap-4 lg:grid-cols-3'>
                {getCustomFields().map(field => (
                  <div key={field.key} className={`space-y-2 ${field.inputType === 'textarea' ? 'lg:col-span-2' : ''}`}>
                    <label className='text-sm font-medium text-gray-700'>
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    {renderField(field, 'custom')}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* システム情報セクション */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-primary">システム情報</h3>
            <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
              {projectBasicInformationConfig[2].fields.map(field => (
                <div key={field.key} className={`space-y-2 ${field.inputType === 'textarea' ? 'lg:col-span-2' : ''}`}>
                  <label className='text-sm font-medium text-gray-700'>
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  {renderField(field, 'system')}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className='border-t p-4 flex gap-2'>
        <Button
          onClick={handleSave}
          disabled={!isModified || isLoading}
          className='flex-1 gap-2'
          variant={isModified ? 'default' : 'outline'}
        >
          <Save className='h-4 w-4' />
          {isLoading ? '保存中...' : '基本情報を保存'}
        </Button>
      </div>
    </div>
  );
}