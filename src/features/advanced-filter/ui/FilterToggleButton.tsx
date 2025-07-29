import React from 'react';
import { Button } from '@/shared/shadcnui';
import { SlidersHorizontal } from 'lucide-react';
import { FilterToggleButtonProps } from '../model/types';

/**
 * フィルターサイドバーの開閉を切り替えるボタンコンポーネント
 */
export function FilterToggleButton({ 
  isOpen, 
  onToggle, 
  className = '',
  children
}: FilterToggleButtonProps) {
  return (
    <Button
      variant={isOpen ? "default" : "outline"}
      size="lg"
      onClick={onToggle}
      className={className}
    >
      <SlidersHorizontal className="h-5 w-5 mr-2" />
      {children || '詳細フィルター'}
    </Button>
  );
}