"use client";
import { Calculator, ShoppingCart, Package, Receipt, FileCheck, ClipboardList } from 'lucide-react';
import { LinkTabNavigation, LinkTabItem } from '@/shared';
import { DocumentType } from '../model';

const documentTabs: LinkTabItem[] = [
  { key: 'quotation', label: '見積書', icon: Calculator, href: '/document/quotation' },
  { key: 'order', label: '発注書', icon: ShoppingCart, href: '/document/order' },
  { key: 'delivery', label: '納品書', icon: Package, href: '/document/delivery' },
  { key: 'invoice', label: '請求書', icon: Receipt, href: '/document/invoice' },
  { key: 'specification', label: '仕様書', icon: FileCheck, href: '/document/specification' },
  { key: 'inspection', label: '検査表', icon: ClipboardList, href: '/document/inspection' },
];

interface DocumentTypeHeaderProps {
  activeType: DocumentType;
}

export function DocumentTypeHeader({ activeType }: DocumentTypeHeaderProps) {
  return (
    <LinkTabNavigation
      items={documentTabs}
      selectedKey={activeType}
    />
  );
}