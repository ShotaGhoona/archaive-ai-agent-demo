"use client";

import { useState, useCallback, useEffect } from "react";
import { Size } from "../types";

interface UseResizableOptions {
  initialSize: Size;
  minSize: Size;
  maxSize: Size;
  disabled?: boolean;
}

export const useResizable = ({ 
  initialSize, 
  minSize, 
  maxSize, 
  disabled = false 
}: UseResizableOptions) => {
  const [size, setSize] = useState<Size>(initialSize);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeStart, setResizeStart] = useState<{ x: number; y: number; width: number; height: number }>({
    x: 0, y: 0, width: 0, height: 0
  });

  const constrainSize = useCallback((newSize: Size): Size => {
    return {
      width: Math.max(minSize.width, Math.min(newSize.width, maxSize.width)),
      height: Math.max(minSize.height, Math.min(newSize.height, maxSize.height))
    };
  }, [minSize, maxSize]);

  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    if (disabled) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    setIsResizing(true);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height
    });
  }, [disabled, size]);

  const handleResizeMove = useCallback((e: MouseEvent) => {
    if (!isResizing || disabled) return;
    
    e.preventDefault();
    
    const deltaX = e.clientX - resizeStart.x;
    const deltaY = e.clientY - resizeStart.y;
    
    const newSize = constrainSize({
      width: resizeStart.width + deltaX,
      height: resizeStart.height + deltaY
    });
    
    setSize(newSize);
  }, [isResizing, resizeStart, constrainSize, disabled]);

  const handleResizeEnd = useCallback(() => {
    setIsResizing(false);
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (disabled) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    const touch = e.touches[0];
    setIsResizing(true);
    setResizeStart({
      x: touch.clientX,
      y: touch.clientY,
      width: size.width,
      height: size.height
    });
  }, [disabled, size]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isResizing || disabled) return;
    
    e.preventDefault();
    
    const touch = e.touches[0];
    const deltaX = touch.clientX - resizeStart.x;
    const deltaY = touch.clientY - resizeStart.y;
    
    const newSize = constrainSize({
      width: resizeStart.width + deltaX,
      height: resizeStart.height + deltaY
    });
    
    setSize(newSize);
  }, [isResizing, resizeStart, constrainSize, disabled]);

  const handleTouchEnd = useCallback(() => {
    setIsResizing(false);
  }, []);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleResizeMove);
      document.addEventListener('mouseup', handleResizeEnd);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
      
      return () => {
        document.removeEventListener('mousemove', handleResizeMove);
        document.removeEventListener('mouseup', handleResizeEnd);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isResizing, handleResizeMove, handleResizeEnd, handleTouchMove, handleTouchEnd]);

  const resizeHandlers = {
    onMouseDown: handleResizeStart,
    onTouchStart: handleTouchStart
  };

  return {
    size,
    isResizing,
    resizeHandlers,
    setSize
  };
};