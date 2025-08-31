import React from 'react';
import { LoadingSpinner } from './LoadingSpinner';

interface LoadingScreenProps {
  message?: string;
  className?: string;
}

export function LoadingScreen({
  message = '読み込み中...',
  className = '',
}: LoadingScreenProps) {
  return (
    <div
      className={`flex min-h-[200px] flex-col items-center justify-center ${className}`}
    >
      <LoadingSpinner size='lg' />
      <p className='mt-4 text-sm font-medium text-gray-600'>{message}</p>
    </div>
  );
}
