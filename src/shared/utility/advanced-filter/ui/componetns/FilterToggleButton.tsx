import React from 'react';
import { Button } from '@/shared';
import { SlidersHorizontal } from 'lucide-react';
import { FilterToggleButtonProps } from '../../model';

/**
 * フィルターサイドバーの開閉を切り替えるボタンコンポーネント
 */
export function FilterToggleButton({ 
  isOpen, 
  onToggle
}: FilterToggleButtonProps) {
  return (
    <Button
      variant={isOpen ? "default" : "outline"}
      size="lg"
      onClick={onToggle}
    >
      <SlidersHorizontal className="h-5 w-5 mr-2" />
      {isOpen ? '閉じる' : '詳細フィルター'}
    </Button>
  );
}