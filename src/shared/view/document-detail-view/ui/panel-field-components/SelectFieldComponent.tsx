import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Label } from '@/shared';
import { DocumentPanelColumn } from '../../model';

interface SelectFieldComponentProps<T> {
  item: T;
  column: DocumentPanelColumn<T>;
  value: unknown;
  onChange: (value: string) => void;
}

export function SelectFieldComponent<T>({
  column,
  value,
  onChange,
}: SelectFieldComponentProps<T>) {
  return (
    <div className="space-y-2">
      <Label>{column.label}</Label>
      <Select
        value={String(value || '')}
        onValueChange={onChange}
        disabled={!column.editable}
      >
        <SelectTrigger className={!column.editable ? "bg-gray-50" : ""}>
          <SelectValue placeholder={column.placeholder} />
        </SelectTrigger>
        <SelectContent>
          {column.selectOptions?.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}