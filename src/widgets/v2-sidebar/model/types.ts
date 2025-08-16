export interface V2SidebarItem {
  id: string;
  name: string;
  type: 'folder' | 'blueprint' | 'project-info' | 'quotation' | 'delivery' | 'inspection' | 'custom';
  icon: React.ReactNode;
  iconColor: string;
  children?: V2SidebarItem[];
  parentId?: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface V2SidebarProps {}

export interface Column {
  id: string;
  items: V2SidebarItem[];
  selectedItemId?: string;
  parentItem?: V2SidebarItem;
  isCollapsed?: boolean;
}

export interface ItemTypeOption {
  value: V2SidebarItem['type'];
  label: string;
  icon: React.ReactNode;
  description: string;
}

export interface IconColorOption {
  value: string;
  label: string;
  color: string;
}