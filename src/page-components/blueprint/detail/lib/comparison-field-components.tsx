import React from 'react';
import { Input } from "@/shared/shadcnui";
import { createHighlightedTextElements } from './text-diff-highlighter';

interface EditableComparisonFieldProps {
  value: string;
  compareValue: string;
  onChange?: (value: string) => void;
  className?: string;
  readOnly?: boolean;
  showHighlight?: boolean;
}

interface ReadOnlyComparisonFieldProps {
  value: string;
  compareValue: string;
  showDifferences?: boolean;
}

/**
 * 編集可能な比較フィールド（現在の図面用）
 * 異なる部分が赤色でハイライトされる
 */
export function EditableComparisonField({ 
  value, 
  compareValue: _, 
  onChange, 
  className = "",
  readOnly = false,
  showHighlight: __ = true 
}: EditableComparisonFieldProps) {
  if (readOnly) {
    // readOnlyの場合は通常表示（ハイライトなし）
    return (
      <div className="p-3 bg-gray-50 border rounded-md text-sm font-medium h-10 flex items-center">
        {value || '-'}
      </div>
    );
  }
  
  // 編集可能な場合はInputのみ
  return (
    <Input
      value={value || ''}
      onChange={(e) => onChange?.(e.target.value)}
      className={`h-10 ${className}`}
    />
  );
}

/**
 * 読み取り専用比較フィールド（類似図面用）
 * 通常は差分ハイライトなし（現在の図面側でハイライトするため）
 */
export function ReadOnlyComparisonField({ 
  value, 
  compareValue,
  showDifferences = false 
}: ReadOnlyComparisonFieldProps) {
  if (showDifferences) {
    const highlightedElements = createHighlightedTextElements(value || '', compareValue || '');
    
    return (
      <div className="p-3 bg-white border border-blue-100 rounded-md text-sm font-medium h-10 flex items-center">
        {highlightedElements || (value || '-')}
      </div>
    );
  }
  
  return (
    <div className="p-3 bg-white border border-blue-100 rounded-md text-sm font-medium h-10 flex items-center">
      {value || '-'}
    </div>
  );
}