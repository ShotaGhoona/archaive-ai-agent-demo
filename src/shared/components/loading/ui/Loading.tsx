import React from 'react';
import { LoadingSpinner } from './LoadingSpinner';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  title?: string;
  description?: string;
  className?: string;
  fullHeight?: boolean;
}

export function Loading({
  size = 'lg',
  title,
  description,
  className = '',
  fullHeight = false,
}: LoadingProps) {
  const containerClasses = fullHeight
    ? 'h-full flex flex-col items-center justify-center'
    : 'flex flex-col items-center justify-center p-4';

  return (
    <div className={`${containerClasses} ${className}`}>
      <div className='flex flex-col items-center justify-center space-y-4'>
        <LoadingSpinner size={size} />
        {(title || description) && (
          <div className='space-y-2 text-center'>
            {title && (
              <p className='text-sm font-medium text-gray-700'>{title}</p>
            )}
            {description && (
              <p className='text-xs text-gray-500'>{description}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
