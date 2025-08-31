'use client';
import React from 'react';
import { Input } from '@/shared';

interface BasicInformationNumberFieldProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export function BasicInformationNumberField({
  value,
  onChange,
  disabled = false,
}: BasicInformationNumberFieldProps) {
  return (
    <Input
      type="number"
      value={String(value || '')}
      onChange={(e) => onChange(Number(e.target.value) || 0)}
      disabled={disabled}
    />
  );
}