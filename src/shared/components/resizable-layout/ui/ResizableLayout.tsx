'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { ResizableContext } from '../lib';
import { ResizableLayoutConfig } from '../model';

interface ResizableLayoutProps {
  config: ResizableLayoutConfig;
  children: React.ReactNode;
  className?: string;
}

export function ResizableLayout({ config, children, className = '' }: ResizableLayoutProps) {
  const [panelSizes, setPanelSizes] = useState<number[]>(() => {
    return config.panels.map(panel => {
      if (config.direction === 'horizontal') {
        return panel.initialWidth ?? (100 / config.panels.length);
      } else {
        return panel.initialHeight ?? (100 / config.panels.length);
      }
    });
  });
  
  const [isDragging, setIsDragging] = useState(false);
  const [dragHandleIndex, setDragHandleIndex] = useState<number | undefined>();
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !containerRef.current || dragHandleIndex === undefined) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const newSizes = [...panelSizes];
    
    if (config.direction === 'horizontal') {
      const containerWidth = containerRect.width;
      const mouseXInContainer = e.clientX - containerRect.left;
      const mousePercentage = (mouseXInContainer / containerWidth) * 100;
      
      // 現在のハンドル位置を計算
      let currentPosition = 0;
      for (let i = 0; i <= dragHandleIndex; i++) {
        currentPosition += newSizes[i];
      }
      
      const diff = mousePercentage - currentPosition;
      
      // 左パネル（dragHandleIndex）と右パネル（dragHandleIndex + 1）のサイズを調整
      const leftPanel = config.panels[dragHandleIndex];
      const rightPanel = config.panels[dragHandleIndex + 1];
      
      const leftMin = leftPanel.minWidth ?? 10;
      const leftMax = leftPanel.maxWidth ?? 90;
      const rightMin = rightPanel.minWidth ?? 10;
      const rightMax = rightPanel.maxWidth ?? 90;
      
      let newLeftSize = newSizes[dragHandleIndex] + diff;
      let newRightSize = newSizes[dragHandleIndex + 1] - diff;
      
      // 制約チェック
      newLeftSize = Math.max(leftMin, Math.min(leftMax, newLeftSize));
      newRightSize = Math.max(rightMin, Math.min(rightMax, newRightSize));
      
      // 実際の調整値を再計算
      const totalChange = (newLeftSize - newSizes[dragHandleIndex]) + (newRightSize - newSizes[dragHandleIndex + 1]);
      if (Math.abs(totalChange) < 0.1) {
        newSizes[dragHandleIndex] = newLeftSize;
        newSizes[dragHandleIndex + 1] = newRightSize;
      }
    } else {
      // 垂直方向も同様の処理
      const containerHeight = containerRect.height;
      const mouseYInContainer = e.clientY - containerRect.top;
      const mousePercentage = (mouseYInContainer / containerHeight) * 100;
      
      let currentPosition = 0;
      for (let i = 0; i <= dragHandleIndex; i++) {
        currentPosition += newSizes[i];
      }
      
      const diff = mousePercentage - currentPosition;
      
      const topPanel = config.panels[dragHandleIndex];
      const bottomPanel = config.panels[dragHandleIndex + 1];
      
      const topMin = topPanel.minHeight ?? 10;
      const topMax = topPanel.maxHeight ?? 90;
      const bottomMin = bottomPanel.minHeight ?? 10;
      const bottomMax = bottomPanel.maxHeight ?? 90;
      
      let newTopSize = newSizes[dragHandleIndex] + diff;
      let newBottomSize = newSizes[dragHandleIndex + 1] - diff;
      
      newTopSize = Math.max(topMin, Math.min(topMax, newTopSize));
      newBottomSize = Math.max(bottomMin, Math.min(bottomMax, newBottomSize));
      
      const totalChange = (newTopSize - newSizes[dragHandleIndex]) + (newBottomSize - newSizes[dragHandleIndex + 1]);
      if (Math.abs(totalChange) < 0.1) {
        newSizes[dragHandleIndex] = newTopSize;
        newSizes[dragHandleIndex + 1] = newBottomSize;
      }
    }
    
    setPanelSizes(newSizes);
  }, [isDragging, dragHandleIndex, panelSizes, config]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setDragHandleIndex(undefined);
  }, []);

  const handleSetIsDragging = useCallback((dragging: boolean, handleIndex?: number) => {
    setIsDragging(dragging);
    setDragHandleIndex(handleIndex);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const contextValue = {
    config,
    panelSizes,
    isDragging,
    dragHandleIndex,
    setPanelSizes,
    setIsDragging: handleSetIsDragging,
    containerRef
  };

  const layoutClass = config.direction === 'horizontal' ? 'flex h-full' : 'flex flex-col h-full';

  return (
    <ResizableContext.Provider value={contextValue}>
      <div 
        ref={containerRef}
        className={`${layoutClass} overflow-hidden ${className}`}
      >
        {children}
      </div>
    </ResizableContext.Provider>
  );
}