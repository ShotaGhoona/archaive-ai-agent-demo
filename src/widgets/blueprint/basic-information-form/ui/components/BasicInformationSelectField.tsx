'use client';
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared';

interface Option {
  label: string;
  value: string | number;
}

interface BasicInformationSelectFieldProps {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  disabled?: boolean;
  label?: string;
}

export function BasicInformationSelectField({
  value,
  onChange,
  options,
  disabled = false,
  label,
}: BasicInformationSelectFieldProps) {
  return (
    <Select
      value={value}
      onValueChange={onChange}
      disabled={disabled}
    >
      <SelectTrigger className={`w-full ${disabled ? 'bg-gray-50' : ''}`}>
        <SelectValue placeholder={`${label || '選択'}してください`} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={String(option.value)}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}