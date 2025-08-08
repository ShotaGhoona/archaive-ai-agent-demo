import { useState, useEffect, useRef } from 'react';

interface UseResizablePanelOptions {
  initialWidth?: number;
  minWidth?: number;
  maxWidth?: number;
}

export function useResizablePanel({
  initialWidth = 33.33,
  minWidth = 20,
  maxWidth = 60
}: UseResizablePanelOptions = {}) {
  const [panelWidth, setPanelWidth] = useState(initialWidth);
  const [isDragging, setIsDragging] = useState(false);
  const resizableAreaRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !resizableAreaRef.current) return;
    
    const resizableAreaRect = resizableAreaRef.current.getBoundingClientRect();
    const resizableAreaWidth = resizableAreaRect.width;
    const mouseXInResizableArea = e.clientX - resizableAreaRect.left;
    
    // 右パネルの幅を計算
    const rightPanelPixelWidth = resizableAreaWidth - mouseXInResizableArea;
    const newPanelWidth = Math.max(minWidth, Math.min(maxWidth, (rightPanelPixelWidth / resizableAreaWidth) * 100));
    setPanelWidth(newPanelWidth);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // マウスイベントリスナーの設定
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, minWidth, maxWidth]);

  const centerWidth = 100 - panelWidth;

  return {
    panelWidth,
    centerWidth,
    isDragging,
    resizableAreaRef,
    handleMouseDown
  };
}