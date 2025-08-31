'use client';
import { useResizableContext } from '../lib';
import { useEffect, useRef, useState } from 'react';

interface ResizableHandleProps {
  className?: string;
}

export function ResizableHandle({ className = '' }: ResizableHandleProps) {
  const { config, isDragging, setIsDragging } = useResizableContext();
  const handleRef = useRef<HTMLDivElement>(null);
  const [handleIndex, setHandleIndex] = useState<number>(-1);

  useEffect(() => {
    // ハンドルのインデックスを計算（簡単な方法）
    if (handleRef.current?.parentElement) {
      const parent = handleRef.current.parentElement;
      const allChildren = Array.from(parent.children);
      const currentIndex = allChildren.indexOf(handleRef.current);

      // パネル → ハンドル → パネル → ハンドル の順序で配置されている前提
      // ハンドルは奇数番目（1, 3, 5...）に位置
      const calculatedHandleIndex = Math.floor(currentIndex / 2);

      setHandleIndex(calculatedHandleIndex);
    }
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true, handleIndex);
  };

  const isHorizontal = config.direction === 'horizontal';
  const cursorClass = isHorizontal ? 'cursor-col-resize' : 'cursor-row-resize';
  const sizeClass = isHorizontal ? 'w-1' : 'h-1';
  const handleBarClass = isHorizontal ? 'w-0.5 h-8' : 'h-0.5 w-8';

  return (
    <div
      ref={handleRef}
      className={`resizable-handle bg-gray-200 hover:bg-gray-300 ${cursorClass} ${sizeClass} flex items-center justify-center transition-colors ${
        isDragging ? 'bg-gray-300' : ''
      } ${className}`}
      onMouseDown={handleMouseDown}
    >
      <div className={`rounded-full bg-gray-400 ${handleBarClass}`} />
    </div>
  );
}
