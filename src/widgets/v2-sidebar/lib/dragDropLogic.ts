import { Column, V2SidebarItem } from '../model/types';

export interface DragDropState {
  draggedItemIndex: number | null;
  draggedColumnIndex: number | null;
}

export const handleDragStart = (
  e: React.DragEvent,
  itemIndex: number,
  columnIndex: number,
  setState: (state: DragDropState) => void
) => {
  e.stopPropagation();
  setState({
    draggedItemIndex: itemIndex,
    draggedColumnIndex: columnIndex
  });
  e.dataTransfer.effectAllowed = 'move';
};

export const handleDragOver = (e: React.DragEvent) => {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
};

export const handleDrop = (
  e: React.DragEvent,
  targetIndex: number,
  columnIndex: number,
  dragState: DragDropState,
  columns: Column[],
  sidebarData: V2SidebarItem[],
  onColumnsUpdate: (columns: Column[]) => void,
  onSidebarDataUpdate: (data: V2SidebarItem[]) => void,
  resetDragState: () => void
) => {
  e.preventDefault();
  e.stopPropagation();
  
  const { draggedItemIndex, draggedColumnIndex } = dragState;
  
  if (draggedItemIndex === null || draggedColumnIndex === null || draggedColumnIndex !== columnIndex) {
    resetDragState();
    return;
  }

  if (draggedItemIndex === targetIndex) {
    resetDragState();
    return;
  }

  const newColumns = [...columns];
  const items = [...newColumns[columnIndex].items];
  const draggedItem = items[draggedItemIndex];
  
  // Remove dragged item
  items.splice(draggedItemIndex, 1);
  
  // Insert at new position
  const insertIndex = draggedItemIndex < targetIndex ? targetIndex - 1 : targetIndex;
  items.splice(insertIndex, 0, draggedItem);
  
  newColumns[columnIndex] = { ...newColumns[columnIndex], items };
  onColumnsUpdate(newColumns);

  // Update main sidebar data if it's the root column
  if (columnIndex === 0) {
    onSidebarDataUpdate(items);
  }

  resetDragState();
};