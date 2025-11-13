'use client';
import { FilterToggleButton } from '@/shared';
import { SimilarDetailHeaderProps } from '../model';

export function SimilarDetailHeader({
  onToggleFilterSidebar,
  isFilterSidebarOpen,
}: SimilarDetailHeaderProps) {
  return (
    <div className='flex items-center justify-between'>
      <div className='flex items-center gap-4'>
        <h2 className='text-lg font-semibold text-gray-900'>類似図面検索</h2>
        <FilterToggleButton
          isOpen={isFilterSidebarOpen}
          onToggle={onToggleFilterSidebar}
        />
      </div>
    </div>
  );
}
