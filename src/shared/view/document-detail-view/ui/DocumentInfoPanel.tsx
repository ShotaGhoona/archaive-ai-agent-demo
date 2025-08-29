"use client";

import { DocumentData, DocumentDetailViewConfig } from "../model";
import {
  TextFieldComponent,
  NumberFieldComponent,
  DateFieldComponent,
  SelectFieldComponent,
  BooleanFieldComponent,
  UserFieldComponent,
} from "./panel-field-components";

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
      <div className="h-full bg-white border-l flex items-center justify-center">
        <div className="text-center text-gray-500">
          <p>帳票を選択してください</p>
        </div>
      </div>
    );
  }

  const handleFieldChange = (field: string, value: any) => {
    onUpdate({ [field]: value } as Partial<T>);
  };

  const renderField = (column: any) => {
    const value = item[column.key as keyof T];
    const onChange = (newValue: any) => handleFieldChange(column.key, newValue);

    const commonProps = {
      item,
      column,
      value,
      onChange,
    };

    switch (column.inputType) {
      case 'text':
        return <TextFieldComponent key={column.key} {...commonProps} />;
      case 'number':
        return <NumberFieldComponent key={column.key} {...commonProps} />;
      case 'date':
        return <DateFieldComponent key={column.key} {...commonProps} />;
      case 'select':
        return <SelectFieldComponent key={column.key} {...commonProps} />;
      case 'boolean':
        return <BooleanFieldComponent key={column.key} {...commonProps} />;
      case 'user':
        return <UserFieldComponent key={column.key} {...commonProps} />;
      default:
        return <TextFieldComponent key={column.key} {...commonProps} />;
    }
  };

  return (
    <div className="h-full bg-white border-l overflow-y-auto">
      <div className="p-6 space-y-4">
        {config.panelColumnConfig.map(renderField)}
      </div>
    </div>
  );
}