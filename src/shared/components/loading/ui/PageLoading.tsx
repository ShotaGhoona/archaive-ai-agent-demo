import React from 'react';
import { LoadingSpinner } from './LoadingSpinner';

interface PageLoadingProps {
  message?: string;
  fullScreen?: boolean;
}

export function PageLoading({
  message = 'ページを読み込み中...',
  fullScreen = false,
}: PageLoadingProps) {
  const containerClass = fullScreen
    ? 'fixed inset-0 bg-white/80 backdrop-blur-sm z-50'
    : 'flex-1';

  return (
    <div
      className={`${containerClass} flex flex-col items-center justify-center`}
    >
      <div className='flex flex-col items-center space-y-4'>
        <LoadingSpinner size='lg' />
        <div className='text-center'>
          <p className='text-sm font-medium text-gray-700'>{message}</p>
        </div>
      </div>
    </div>
  );
}
