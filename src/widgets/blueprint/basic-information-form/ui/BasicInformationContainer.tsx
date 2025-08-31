'use client';
import React from 'react';
import { Button, getValue } from '@/shared';
import { Save } from 'lucide-react';
import { BlueprintDetailDataInterface } from '@/dummy-data-er-fix/blueprint/interfaces/types';
import { PanelColumnConfig, blueprintBasicInformationConfig, useBasicInformationContainer } from '../lib';
import { 
  BasicInformationTextField,
  BasicInformationSelectField,
  BasicInformationNumberField,
  BasicInformationTextareaField,
  BasicInformationDateField 
} from './components';

interface BasicInformationContainerProps {
  blueprintData?: BlueprintDetailDataInterface;
  onSave?: (data: Partial<BlueprintDetailDataInterface>) => void;
  className?: string;
}

export function BasicInformationContainer({
  blueprintData,
  onSave,
  className = '',
}: BasicInformationContainerProps) {
  const { formData, isModified, handleInputChange, handleSave } =
    useBasicInformationContainer(blueprintData);

  const onSaveClick = () => {
    handleSave(onSave);
  };

  // カスタム項目を動的に生成
  const generateCustomItemsFields = (): PanelColumnConfig[] => {
    if (!formData.drawing_page_custom_items) return [];
    
    return Object.entries(formData.drawing_page_custom_items).map(([key, item]) => {
      const customItem = item as { value: any; color?: string; type: string };
      return {
        key: `drawing_page_custom_items.${key}`,
        label: key,
        inputType: customItem.type === 'select' ? 'select' : 'text',
        editable: true,
        // TODO: select型の場合のoptionsを実装
      } as PanelColumnConfig;
    });
  };

  // カスタム項目フィールドを動的生成
  const customItemsFields = generateCustomItemsFields();

  // 設定からフィールド情報を取得する関数
  const getFieldConfig = (key: string) => {
    const allFields = [
      ...blueprintBasicInformationConfig[0].fields, // 基本情報
      ...blueprintBasicInformationConfig[2].fields, // システム情報
    ];
    return allFields.find(field => field.key === key);
  };

  const renderFormField = (configOrKey: any) => {
    // キーだけが渡された場合は設定から取得
    const config = typeof configOrKey === 'string' 
      ? getFieldConfig(configOrKey) 
      : configOrKey;
    
    if (!config) return null;

    // object-pathを使用して値を取得
    const value = getValue(formData, config.key);

    switch (config.inputType) {
      case 'textarea':
        return (
          <BasicInformationTextareaField
            value={String(value || '')}
            onChange={(newValue) => handleInputChange(config.key, newValue)}
            disabled={!config.editable}
          />
        );

      case 'select':
        return (
          <BasicInformationSelectField
            value={String(value || '')}
            onChange={(newValue) => handleInputChange(config.key, newValue)}
            options={config.options || []}
            disabled={!config.editable}
            label={config.label}
          />
        );

      case 'number':
        return (
          <BasicInformationNumberField
            value={Number(value || 0)}
            onChange={(newValue) => handleInputChange(config.key, newValue)}
            disabled={!config.editable}
          />
        );

      case 'date':
        return (
          <BasicInformationDateField
            value={String(value || '')}
            onChange={(newValue) => handleInputChange(config.key, newValue)}
            disabled={!config.editable}
          />
        );

      default:
        return (
          <BasicInformationTextField
            value={String(value || '')}
            onChange={config.editable ? (newValue) => handleInputChange(config.key, newValue) : undefined}
            disabled={!config.editable}
            required={config.required}
          />
        );
    }
  };

  return (
    <div className={`flex h-full flex-col ${className}`}>
      <div className='flex-1 overflow-y-auto p-4'>
        <div className="space-y-6">
          {/* 基本情報セクション */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-primary">基本情報</h3>
            <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
              {blueprintBasicInformationConfig[0].fields.map((config) => (
                <div key={config.key} className={`space-y-2 ${config.inputType === 'textarea' ? 'lg:col-span-2' : ''}`}>
                  <label className='text-sm font-medium text-gray-700'>
                    {config.label}
                    {config.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  {renderFormField(config.key)}
                </div>
              ))}
            </div>
          </div>

          {/* カスタム項目セクション */}
          {customItemsFields.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-primary">
                カスタム項目
              </h3>
              <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
                {customItemsFields.map((config) => (
                  <div key={config.key} className='space-y-2'>
                    <label className='text-sm font-medium text-gray-700'>
                      {config.label}
                      {config.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    {renderFormField(config)}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* システム情報セクション */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-primary">
              システム情報
            </h3>
            <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
              {blueprintBasicInformationConfig[2].fields.map((config) => (
                <div key={config.key} className='space-y-2'>
                  <label className='text-sm font-medium text-gray-700'>
                    {config.label}
                    {config.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  {renderFormField(config.key)}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className='border-t p-4 flex gap-2'>
        <Button
          onClick={onSaveClick}
          disabled={!isModified}
          className='flex-1 gap-2'
          variant={isModified ? 'default' : 'outline'}
        >
          <Save className='h-4 w-4' />
          基本情報を保存
        </Button>
      </div>
    </div>
  );
}