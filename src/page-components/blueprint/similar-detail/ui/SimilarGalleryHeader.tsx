'use client';
import { FilterToggleButton, Button } from '@/shared';
import { ChevronRight, ChevronLeft } from 'lucide-react';

interface SimilarGalleryHeaderProps {
  onToggleFilterSidebar: () => void;
  isFilterSidebarOpen: boolean;
  onNavigateToDetailView?: () => void;
  onNavigateBack?: () => void;
  showBackButton?: boolean;
}

export function SimilarGalleryHeader({
  onToggleFilterSidebar,
  isFilterSidebarOpen,
  onNavigateToDetailView,
  onNavigateBack,
  showBackButton = false,
}: SimilarGalleryHeaderProps) {
  return (
    <div className='flex items-center justify-between border-b bg-white p-4'>
      <div className='flex items-center gap-3'>
        {showBackButton && onNavigateBack && (
          <Button
            variant='ghost'
            size='sm'
            onClick={onNavigateBack}
          >
            <ChevronLeft className='mr-1 h-4 w-4' />
            戻る
          </Button>
        )}
        <h3 className='text-sm font-semibold text-gray-900'>類似図面詳細</h3>
      </div>
      <div className='flex items-center gap-2'>
        {onNavigateToDetailView && (
          <Button
            variant='outline'
            size='sm'
            onClick={onNavigateToDetailView}
          >
            <ChevronRight className='mr-1 h-4 w-4' />
            詳細を見る
          </Button>
        )}
        <FilterToggleButton
          isOpen={isFilterSidebarOpen}
          onToggle={onToggleFilterSidebar}
        />
      </div>
    </div>
  );
}
