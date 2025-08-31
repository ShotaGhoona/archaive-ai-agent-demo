'use client';

import {
  DocumentData,
  DocumentDetailViewConfig,
  DocumentPanelColumn,
} from '../model';
import {
  TextFieldComponent,
  NumberFieldComponent,
  DateFieldComponent,
  SelectFieldComponent,
  BooleanFieldComponent,
  UserFieldComponent,
} from './panel-field-components';
import { getValue, setValue } from '@/shared';

interface DocumentInfoPanelProps<T extends DocumentData> {
  item: T | null;
  config: DocumentDetailViewConfig<T>;
  onUpdate: (data: Partial<T>) => void;
}

export function DocumentInfoPanel<T extends DocumentData>({
  item,
  config,
  onUpdate,
}: DocumentInfoPanelProps<T>) {
  if (!item) {
    return (
      <div className='flex h-full items-center justify-center border-l bg-white'>
        <div className='text-center text-gray-500'>
          <p>帳票を選択してください</p>
        </div>
      </div>
    );
  }

  const handleFieldChange = (field: string, value: unknown) => {
    if (field.includes('.')) {
      const updatedItem = { ...item };
      setValue(updatedItem as Record<string, unknown>, field, value);
      onUpdate(updatedItem as Partial<T>);
    } else {
      onUpdate({ [field]: value } as Partial<T>);
    }
  };

  const renderField = (column: DocumentPanelColumn<T>) => {
    const fieldKey = String(column.key);
    const value = fieldKey.includes('.')
      ? getValue(item, fieldKey)
      : item[column.key as keyof T];
    const onChange = (newValue: unknown) =>
      handleFieldChange(fieldKey, newValue);

    const commonProps = {
      item,
      column,
      value,
      onChange,
    };

    switch (column.inputType) {
      case 'text':
        return <TextFieldComponent key={fieldKey} {...commonProps} />;
      case 'number':
        return <NumberFieldComponent key={fieldKey} {...commonProps} />;
      case 'date':
        return <DateFieldComponent key={fieldKey} {...commonProps} />;
      case 'select':
        return <SelectFieldComponent key={fieldKey} {...commonProps} />;
      case 'boolean':
        return <BooleanFieldComponent key={fieldKey} {...commonProps} />;
      case 'user':
        return <UserFieldComponent key={fieldKey} {...commonProps} />;
      default:
        return <TextFieldComponent key={fieldKey} {...commonProps} />;
    }
  };

  return (
    <div className='h-full overflow-y-auto border-l bg-white'>
      <div className='space-y-4 p-6'>
        {config.panelColumnConfig.map(renderField)}
      </div>
    </div>
  );
}
