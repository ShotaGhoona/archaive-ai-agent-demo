"use client";
import { Calculator, ShoppingCart, Package, Receipt, FileCheck, ClipboardList } from 'lucide-react';
import { LinkTabNavigation, LinkTabItem } from '@/shared';
import { usePathname } from 'next/navigation';

const documentTabs: LinkTabItem[] = [
  { key: 'quotation', label: '見積書', icon: Calculator, href: '/document/quotation' },
  { key: 'order', label: '発注書', icon: ShoppingCart, href: '/document/order' },
  { key: 'delivery', label: '納品書', icon: Package, href: '/document/delivery' },
  { key: 'invoice', label: '請求書', icon: Receipt, href: '/document/invoice' },
  { key: 'specification', label: '仕様書', icon: FileCheck, href: '/document/specification' },
  { key: 'inspection', label: '検査表', icon: ClipboardList, href: '/document/inspection' },
];

export default function DocumentLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // パスから現在のドキュメントタイプを取得
  const getCurrentDocumentType = () => {
    const segments = pathname.split('/');
    const documentType = segments[segments.length - 1];
    return documentType || 'quotation';
  };

  return (
    <div className="h-[calc(100vh-45px)] flex flex-col">
      {/* Document Type Tab Navigation */}
      <div className="flex-shrink-0">
        <LinkTabNavigation
          items={documentTabs}
          selectedKey={getCurrentDocumentType()}
        />
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 min-h-0">
        {children}
      </div>
    </div>
  );
}