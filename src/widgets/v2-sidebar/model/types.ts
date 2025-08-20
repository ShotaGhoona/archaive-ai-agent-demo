export interface V2SidebarItem {
  id: string;
  name: string;
  type: 'project-folder' | 'folder' | 'blueprint' | 'project-info' | 'quotation' | 'order' | 'delivery-note' | 'inspection-report' | 'specification' | 'shipping-label' | 'outsource-quotation' | 'outsource-order' | 'outsource-delivery' | '3d-model' | 'custom';
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
  colSpan: 1 | 2;
  rowSpan: 1 | 2;
}

export interface IconColorOption {
  value: string;
  label: string;
  color: string;
}