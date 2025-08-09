'use client';
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { Button } from "@/shared/shadcnui";
import { customerMenuItems } from "../constants/customer";

export function CustomerTabNavigation() {
  const pathname = usePathname();
  const params = useParams();
  const customerId = params.id as string;

  const getCurrentTab = () => {
    const pathSegments = pathname.split('/');
    const lastSegment = pathSegments[pathSegments.length - 1];
    
    if (lastSegment === customerId) {
      return 'profile';
    }
    
    const foundTab = customerMenuItems.find(tab => tab.id === lastSegment);
    return foundTab ? foundTab.id : 'profile';
  };

  const activeTab = getCurrentTab();

  return (
    <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
      {customerMenuItems.map((tab) => {
        const isActive = activeTab === tab.id;
        const href = tab.href.replace("[id]", customerId);
        
        return (
          <Link key={tab.id} href={href}>
            <Button
              variant={isActive ? "default" : "ghost"}
              size="lg"
              className={`
                flex-shrink-0 h-12 px-4 gap-2 text-sm font-medium transition-all
                ${isActive 
                  ? "bg-primary text-primary-foreground shadow-sm" 
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }
              `}
            >
              {tab.icon}
              {tab.label}
            </Button>
          </Link>
        );
      })}
    </div>
  );
}