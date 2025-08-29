import React from 'react';
import { Input, Label } from '@/shared';
import { DocumentPanelColumn } from '../../model';

interface DateFieldComponentProps<T> {
  item: T;
  column: DocumentPanelColumn<T>;
  value: unknown;
  onChange: (value: string) => void;
}

export function DateFieldComponent<T>({
  item,
  column,
  value,
  onChange,
}: DateFieldComponentProps<T>) {
  const formatDateForInput = (dateValue: unknown) => {
    if (!dateValue) return '';
    const date = new Date(String(dateValue));
    return date.toISOString().split('T')[0];
  };

  const handleChange = (inputValue: string) => {
    const isoString = inputValue ? new Date(inputValue).toISOString() : '';
    onChange(isoString);
  };

  return (
    <div className="space-y-2">
      <Label>{column.label}</Label>
      <Input
        value={formatDateForInput(value)}
        onChange={(e) => handleChange(e.target.value)}
        disabled={!column.editable}
        placeholder={column.placeholder}
        className={!column.editable ? "bg-gray-50" : ""}
        type="date"
      />
    </div>
  );
}