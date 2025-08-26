"use client";
import { DocumentType, DocumentTypeHeaderProps } from '../model';
import { TabNavigation, TabItem } from '@/shared';
import { Calculator, ShoppingCart, Package, Receipt, FileCheck, ClipboardList } from 'lucide-react';

const documentTypes: TabItem[] = [
  { key: 'quotation', label: '見積書', icon: Calculator },
  { key: 'order', label: '発注書', icon: ShoppingCart },
  { key: 'delivery', label: '納品書', icon: Package },
  { key: 'invoice', label: '請求書', icon: Receipt },
  { key: 'specification', label: '仕様書', icon: FileCheck },
  { key: 'inspection', label: '検査表', icon: ClipboardList },
];

export function DocumentTypeHeader({
  selectedType,
  onTypeChange,
}: DocumentTypeHeaderProps) {
  return (
    <TabNavigation
      items={documentTypes}
      selectedKey={selectedType}
      onTabChange={(key) => onTypeChange(key as DocumentType)}
    />
  );
}