import { useState, useCallback } from 'react';

interface Position {
  x: number;
  y: number;
}

interface DragState {
  position: Position;
  isDragging: boolean;
}

interface DragActions {
  handleMouseDown: (e: React.MouseEvent) => void;
  handleMouseMove: (e: React.MouseEvent) => void;
  handleMouseUp: () => void;
  resetPosition: () => void;
  setPosition: (position: Position) => void;
}

export function useDragPan(): DragState & DragActions {
  const [position, setPositionValue] = useState<Position>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<Position>({ x: 0, y: 0 });

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  }, [position]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    setPositionValue({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const resetPosition = useCallback(() => {
    setPositionValue({ x: 0, y: 0 });
  }, []);

  const setPosition = useCallback((newPosition: Position) => {
    setPositionValue(newPosition);
  }, []);

  return {
    position,
    isDragging,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    resetPosition,
    setPosition
  };
}