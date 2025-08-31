'use client';
import { useState, useEffect, useCallback } from 'react';
import { ColumnWidths, ResizeState, DataTableColumn } from '../model';

interface UseColumnResizeProps<T> {
  columns: DataTableColumn<T>[];
  initialWidths?: ColumnWidths;
}

export function useColumnResize<T>({
  columns,
  initialWidths,
}: UseColumnResizeProps<T>) {
  const [columnWidths, setColumnWidths] = useState<ColumnWidths>(() => {
    if (initialWidths) return initialWidths;

    // columns から初期幅を生成
    return columns.reduce((acc, col) => {
      acc[col.key as string] = col.width;
      return acc;
    }, {} as ColumnWidths);
  });

  const [resizeState, setResizeState] = useState<ResizeState | null>(null);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent, field: string) => {
      e.preventDefault();
      e.stopPropagation();

      setResizeState({
        isResizing: true,
        startX: e.clientX,
        startWidth: columnWidths[field],
        columnField: field,
      });
    },
    [columnWidths],
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!resizeState?.isResizing) return;

      const diff = e.clientX - resizeState.startX;
      const newWidth = Math.max(60, resizeState.startWidth + diff); // 最小幅60px

      setColumnWidths((prev) => ({
        ...prev,
        [resizeState.columnField]: newWidth,
      }));
    },
    [resizeState],
  );

  const handleMouseUp = useCallback(() => {
    setResizeState(null);
  }, []);

  // グローバルマウスイベントの設定
  useEffect(() => {
    if (resizeState?.isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      };
    }
  }, [resizeState, handleMouseMove, handleMouseUp]);

  const getColumnWidth = useCallback(
    (field: string) => {
      return columnWidths[field] || 128;
    },
    [columnWidths],
  );

  return {
    columnWidths,
    resizeState,
    handleMouseDown,
    getColumnWidth,
    setColumnWidths,
  };
}
