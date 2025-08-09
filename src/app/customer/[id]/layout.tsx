'use client';
import { CustomerTabNavigation } from "@/shared/basic-layout/ui/CustomerTabNavigation";

interface CustomerDetailLayoutProps {
  children: React.ReactNode;
}

export default function CustomerDetailLayout({ 
  children
}: CustomerDetailLayoutProps) {
  return (
    <div className="h-[calc(100vh-45px)] flex flex-col overflow-hidden">
      <div className="flex-shrink-0 p-4 border-b bg-white">
        <div className="flex items-center justify-between">
          <CustomerTabNavigation />
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  );
}