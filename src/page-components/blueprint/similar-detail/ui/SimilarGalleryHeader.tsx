'use client';
import { FilterToggleButton } from '@/shared';

interface SimilarGalleryHeaderProps {
  onToggleFilterSidebar: () => void;
  isFilterSidebarOpen: boolean;
}

export function SimilarGalleryHeader({
  onToggleFilterSidebar,
  isFilterSidebarOpen,
}: SimilarGalleryHeaderProps) {
  return (
    <div className='flex items-center justify-between border-b bg-white p-4'>
      <h3 className='text-sm font-semibold text-gray-900'>類似図面</h3>
      <FilterToggleButton
        isOpen={isFilterSidebarOpen}
        onToggle={onToggleFilterSidebar}
      />
    </div>
  );
}
