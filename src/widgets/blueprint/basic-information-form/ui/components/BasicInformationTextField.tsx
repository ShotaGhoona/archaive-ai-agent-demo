'use client';
import React from 'react';
import { Input } from '@/shared';

interface BasicInformationTextFieldProps {
  value: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
}

export function BasicInformationTextField({
  value,
  onChange,
  disabled = false,
  required = false,
}: BasicInformationTextFieldProps) {
  return (
    <Input
      value={value}
      onChange={onChange ? (e) => onChange(e.target.value) : undefined}
      disabled={disabled}
      required={required}
      readOnly={!onChange}
      className={!onChange ? 'bg-gray-50' : ''}
    />
  );
}