import React from 'react';
import { Input, Label } from '@/shared';
import { DocumentPanelColumn } from '../../model';

interface NumberFieldComponentProps<T> {
  item: T;
  column: DocumentPanelColumn<T>;
  value: unknown;
  onChange: (value: number) => void;
}

export function NumberFieldComponent<T>({
  column,
  value,
  onChange,
}: NumberFieldComponentProps<T>) {
  return (
    <div className='space-y-2'>
      <Label>{column.label}</Label>
      <Input
        value={String(value || '')}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        disabled={!column.editable}
        placeholder={column.placeholder}
        className={!column.editable ? 'bg-gray-50' : ''}
        type='number'
      />
    </div>
  );
}
