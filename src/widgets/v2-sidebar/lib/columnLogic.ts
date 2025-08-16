import { Column, V2SidebarItem } from '../model/types';
import { findItemById } from './sidebarUtils';

export const handleItemClick = (
  item: V2SidebarItem,
  columnIndex: number,
  columns: Column[]
): Column[] => {
  // Update selected item in current column
  const newColumns = [...columns];
  newColumns[columnIndex].selectedItemId = item.id;
  
  // Remove columns to the right
  newColumns.splice(columnIndex + 1);
  
  // If item is a folder, add new column (even if empty)
  if (item.type === 'folder') {
    newColumns.push({
      id: `column-${item.id}`,
      items: item.children || [],
      parentItem: item,
      isCollapsed: false
    });
  }
  
  return newColumns;
};

export const handleColumnToggle = (
  columnIndex: number,
  columns: Column[]
): Column[] => {
  const newColumns = [...columns];
  newColumns[columnIndex] = {
    ...newColumns[columnIndex],
    isCollapsed: !newColumns[columnIndex].isCollapsed
  };
  return newColumns;
};

export const updateColumnsAfterAdd = (
  columns: Column[],
  sidebarData: V2SidebarItem[],
  parentId?: string
): Column[] => {
  const newColumns = [...columns];
  
  if (!parentId) {
    newColumns[0] = { ...newColumns[0], items: sidebarData };
  } else {
    // Find and update the relevant column
    for (let i = 0; i < newColumns.length; i++) {
      if (newColumns[i].parentItem?.id === parentId) {
        const parentItem = findItemById(sidebarData, parentId);
        if (parentItem && parentItem.children) {
          newColumns[i] = { ...newColumns[i], items: parentItem.children };
        }
        break;
      }
    }
  }
  
  return newColumns;
};

export const updateColumnsAfterDelete = (
  columns: Column[],
  sidebarData: V2SidebarItem[]
): Column[] => {
  const newColumns = [...columns];
  newColumns[0] = { ...newColumns[0], items: sidebarData };
  return newColumns;
};