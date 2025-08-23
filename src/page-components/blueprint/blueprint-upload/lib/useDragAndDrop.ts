import { useState, useCallback } from 'react';
import { DragItem } from '../model';

export function useDragAndDrop() {
  const [draggedItem, setDraggedItem] = useState<DragItem | null>(null);
  const [dragOverTarget, setDragOverTarget] = useState<string | null>(null);

  // ドラッグ開始
  const handleDragStart = useCallback((item: DragItem) => {
    setDraggedItem(item);
  }, []);

  // ドラッグ終了
  const handleDragEnd = useCallback(() => {
    setDraggedItem(null);
    setDragOverTarget(null);
  }, []);

  // ドラッグオーバー
  const handleDragOver = useCallback((e: React.DragEvent, targetId?: string) => {
    e.preventDefault();
    setDragOverTarget(targetId || null);
  }, []);

  // ドラッグリーブ
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    // 子要素に移動した場合は無視
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setDragOverTarget(null);
    }
  }, []);

  // ドロップ
  const handleDrop = useCallback((
    e: React.DragEvent, 
    onDropToNewProject?: (item: DragItem) => void,
    onDropToProject?: (item: DragItem, projectId: string) => void,
    targetProjectId?: string
  ) => {
    e.preventDefault();
    
    if (!draggedItem) return;

    if (targetProjectId && onDropToProject) {
      onDropToProject(draggedItem, targetProjectId);
    } else if (onDropToNewProject) {
      onDropToNewProject(draggedItem);
    }

    handleDragEnd();
  }, [draggedItem, handleDragEnd]);

  return {
    draggedItem,
    dragOverTarget,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  };
}