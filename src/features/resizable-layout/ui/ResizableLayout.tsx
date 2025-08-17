'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { ResizableContext } from '../lib/useResizableContext';
import { ResizableLayoutConfig } from '../model/types';

interface ResizableLayoutProps {
  config: ResizableLayoutConfig;
  children: React.ReactNode;
  className?: string;
}

export function ResizableLayout({ config, children, className = '' }: ResizableLayoutProps) {
  const [panelSizes, setPanelSizes] = useState<[number, number]>(() => {
    if (config.direction === 'horizontal') {
      return [
        config.panels[0].initialWidth ?? 50,
        config.panels[1].initialWidth ?? 50
      ];
    } else {
      return [
        config.panels[0].initialHeight ?? 50,
        config.panels[1].initialHeight ?? 50
      ];
    }
  });
  
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    
    if (config.direction === 'horizontal') {
      const containerWidth = containerRect.width;
      const mouseXInContainer = e.clientX - containerRect.left;
      const newFirstPanelWidth = (mouseXInContainer / containerWidth) * 100;
      
      const minWidth = config.panels[0].minWidth ?? 10;
      const maxWidth = config.panels[0].maxWidth ?? 90;
      const clampedWidth = Math.max(minWidth, Math.min(maxWidth, newFirstPanelWidth));
      
      setPanelSizes([clampedWidth, 100 - clampedWidth]);
    } else {
      const containerHeight = containerRect.height;
      const mouseYInContainer = e.clientY - containerRect.top;
      const newFirstPanelHeight = (mouseYInContainer / containerHeight) * 100;
      
      const minHeight = config.panels[0].minHeight ?? 10;
      const maxHeight = config.panels[0].maxHeight ?? 90;
      const clampedHeight = Math.max(minHeight, Math.min(maxHeight, newFirstPanelHeight));
      
      setPanelSizes([clampedHeight, 100 - clampedHeight]);
    }
  }, [isDragging, config]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
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
    setPanelSizes,
    setIsDragging,
    containerRef
  };

  const layoutClass = config.direction === 'horizontal' ? 'flex' : 'flex flex-col';

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