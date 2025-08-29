import React from 'react';
import { Input, Label } from '@/shared';
import { DocumentPanelColumn } from '../../model';

interface UserFieldComponentProps<T> {
  item: T;
  column: DocumentPanelColumn<T>;
  value: unknown;
  onChange: (value: string) => void;
}

export function UserFieldComponent<T>({
  column,
  value,
  onChange,
}: UserFieldComponentProps<T>) {
  return (
    <div className="space-y-2">
      <Label>{column.label}</Label>
      <Input
        value={String(value || '')}
        onChange={(e) => onChange(e.target.value)}
        disabled={!column.editable}
        placeholder={column.placeholder || "従業員を選択"}
        className={!column.editable ? "bg-gray-50" : ""}
        type="text"
      />
    </div>
  );
}