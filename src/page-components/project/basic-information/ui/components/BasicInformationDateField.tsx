'use client';
import React from 'react';
import { Input } from '@/shared';

interface BasicInformationDateFieldProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function BasicInformationDateField({
  value,
  onChange,
  disabled = false,
}: BasicInformationDateFieldProps) {
  return (
    <Input
      type="datetime-local"
      value={value ? new Date(value).toISOString().slice(0, 16) : ''}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
    />
  );
}