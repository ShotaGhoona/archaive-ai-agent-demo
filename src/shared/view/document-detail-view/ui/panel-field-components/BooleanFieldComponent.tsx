import React from 'react';
import { Switch, Label } from '@/shared';
import { DocumentPanelColumn } from '../../model';

interface BooleanFieldComponentProps<T> {
  item: T;
  column: DocumentPanelColumn<T>;
  value: unknown;
  onChange: (value: boolean) => void;
}

export function BooleanFieldComponent<T>({
  item,
  column,
  value,
  onChange,
}: BooleanFieldComponentProps<T>) {
  return (
    <div className="space-y-2">
      <Label>{column.label}</Label>
      <div className="flex items-center space-x-2">
        <Switch
          checked={Boolean(value)}
          onCheckedChange={onChange}
          disabled={!column.editable}
        />
        <span className={value ? 'text-green-600' : 'text-gray-500'}>
          {value ? 'はい' : 'いいえ'}
        </span>
      </div>
    </div>
  );
}