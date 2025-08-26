import React from 'react';
import { LoadingSpinner } from './LoadingSpinner';

interface LoadingScreenProps {
  message?: string;
  className?: string;
}

export function LoadingScreen({ message = '読み込み中...', className = '' }: LoadingScreenProps) {
  return (
    <div className={`flex flex-col items-center justify-center min-h-[200px] ${className}`}>
      <LoadingSpinner size="lg" />
      <p className="mt-4 text-sm text-gray-600 font-medium">{message}</p>
    </div>
  );
}