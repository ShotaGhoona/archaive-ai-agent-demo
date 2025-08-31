'use client';
import React from 'react';
import { Textarea } from '@/shared';

interface BasicInformationTextareaFieldProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  rows?: number;
}

export function BasicInformationTextareaField({
  value,
  onChange,
  disabled = false,
  rows = 3,
}: BasicInformationTextareaFieldProps) {
  return (
    <Textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="入力してください"
      disabled={disabled}
      rows={rows}
    />
  );
}