import React from 'react';
import { Input } from "@/shared";
import { ComparisonFieldProps } from "../model";
import { createHighlightedTextElements } from '../lib';

/**
 * 編集可能な比較フィールド（現在のアイテム用）
 */
export function EditableComparisonField({ 
  config,
  currentValue,
  isEditable = true,
  onChange
}: ComparisonFieldProps) {
  const displayValue = config.formatter ? config.formatter(currentValue) : String(currentValue || '');
  
  if (config.readOnly || !isEditable) {
    return (
      <div className="p-3 bg-gray-50 border rounded-md text-sm font-medium h-10 flex items-center">
        {displayValue || '-'}
      </div>
    );
  }
  
  return (
    <Input
      value={displayValue}
      onChange={(e) => onChange?.(e.target.value)}
      className="h-10"
    />
  );
}

/**
 * 読み取り専用比較フィールド（比較対象用）
 */
export function ReadOnlyComparisonField({ 
  config,
  currentValue,
  comparisonValue,
}: ComparisonFieldProps) {
  const displayValue = config.formatter ? config.formatter(comparisonValue) : String(comparisonValue || '');
  const compareValue = config.formatter ? config.formatter(currentValue) : String(currentValue || '');
  
  // 差分ハイライト表示
  const highlightedElements = createHighlightedTextElements(displayValue, compareValue);
  
  return (
    <div className="p-3 bg-white border border-blue-100 rounded-md text-sm font-medium h-10 flex items-center">
      {highlightedElements || displayValue || '-'}
    </div>
  );
}