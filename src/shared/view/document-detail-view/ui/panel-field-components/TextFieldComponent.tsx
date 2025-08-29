import React from 'react';
import { Input, Label } from '@/shared';
import { DocumentPanelColumn } from '../../model';

interface TextFieldComponentProps<T> {
  item: T;
  column: DocumentPanelColumn<T>;
  value: unknown;
  onChange: (value: string) => void;
}

export function TextFieldComponent<T>({
  column,
  value,
  onChange,
}: TextFieldComponentProps<T>) {
  return (
    <div className="space-y-2">
      <Label>{column.label}</Label>
      <Input
        value={String(value || '')}
        onChange={(e) => onChange(e.target.value)}
        disabled={!column.editable}
        placeholder={column.placeholder}
        className={!column.editable ? "bg-gray-50" : ""}
        type="text"
      />
    </div>
  );
}