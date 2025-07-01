"use client";

import { useState, useCallback, useEffect } from "react";
import { Position } from "../types";

interface UseDraggableOptions {
  initialPosition: Position;
  disabled?: boolean;
}

export const useDraggable = ({ initialPosition, disabled = false }: UseDraggableOptions) => {
  const [position, setPosition] = useState<Position>(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 });

  const constrainPosition = useCallback((pos: Position): Position => {
    const maxX = window.innerWidth - 400; // モーダル幅を考慮
    const maxY = window.innerHeight - 700; // モーダル高さを考慮
    
    return {
      x: Math.max(0, Math.min(pos.x, maxX)),
      y: Math.max(0, Math.min(pos.y, maxY))
    };
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (disabled) return;
    
    e.preventDefault();
    setIsDragging(true);
    
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  }, [disabled]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || disabled) return;
    
    e.preventDefault();
    
    const newPosition = constrainPosition({
      x: e.clientX - dragOffset.x,
      y: e.clientY - dragOffset.y
    });
    
    setPosition(newPosition);
  }, [isDragging, dragOffset, constrainPosition, disabled]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (disabled) return;
    
    const touch = e.touches[0];
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    
    setIsDragging(true);
    setDragOffset({
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top
    });
  }, [disabled]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging || disabled) return;
    
    e.preventDefault();
    
    const touch = e.touches[0];
    const newPosition = constrainPosition({
      x: touch.clientX - dragOffset.x,
      y: touch.clientY - dragOffset.y
    });
    
    setPosition(newPosition);
  }, [isDragging, dragOffset, constrainPosition, disabled]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  const dragHandlers = {
    onMouseDown: handleMouseDown,
    onTouchStart: handleTouchStart
  };

  return {
    position,
    isDragging,
    dragHandlers,
    setPosition
  };
};