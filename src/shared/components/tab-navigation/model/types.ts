import { LucideIcon } from 'lucide-react';

export interface TabItem {
  key: string;
  label: string;
  icon?: LucideIcon;
}

export interface LinkTabItem extends TabItem {
  href: string;
}

export interface TabNavigationProps {
  items: TabItem[];
  selectedKey: string;
  onTabChange: (key: string) => void;
  className?: string;
}

export interface LinkTabNavigationProps {
  items: LinkTabItem[];
  selectedKey: string;
  className?: string;
}
