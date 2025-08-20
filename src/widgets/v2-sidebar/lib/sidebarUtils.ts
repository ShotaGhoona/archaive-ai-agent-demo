import { V2SidebarItem } from '../model/types';

export const findItemById = (items: V2SidebarItem[], id: string): V2SidebarItem | null => {
  for (const item of items) {
    if (item.id === id) return item;
    if (item.children) {
      const found = findItemById(item.children, id);
      if (found) return found;
    }
  }
  return null;
};

export const generateId = (): string => {
  return `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const addItemToTree = (
  items: V2SidebarItem[], 
  newItem: V2SidebarItem, 
  parentId?: string
): V2SidebarItem[] => {
  if (!parentId) {
    return [...items, newItem];
  }
  
  return items.map(item => {
    if (item.id === parentId) {
      return {
        ...item,
        children: [...(item.children || []), newItem]
      };
    }
    if (item.children) {
      return { ...item, children: addItemToTree(item.children, newItem, parentId) };
    }
    return item;
  });
};

export const deleteItemFromTree = (items: V2SidebarItem[], id: string): V2SidebarItem[] => {
  return items.filter(item => {
    if (item.id === id) return false;
    if (item.children) {
      item.children = deleteItemFromTree(item.children, id);
    }
    return true;
  });
};