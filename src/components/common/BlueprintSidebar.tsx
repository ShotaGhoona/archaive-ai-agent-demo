import { Separator } from "@/shared/shadcnui";
import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { 
  FileText, 
  Wrench, 
  Users, 
  Calculator,
  ShoppingCart,
  Truck,
  CheckCircle,
  Settings
} from "lucide-react";

interface SidebarItem {
  id: string;
  label: string;
  icon: LucideIcon;
  href?: string;
}

interface SidebarSection {
  category: string;
  items: SidebarItem[];
}

interface BlueprintSidebarProps {
  sections: SidebarSection[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  headerContent?: React.ReactNode;
}

// サイドバーメニューの定義
export const getSidebarMenus = (blueprintId: string): SidebarSection[] => [
  {
    category: "基本情報",
    items: [
      { id: "overview", label: "図面詳細", icon: FileText, href: `/blueprints/${blueprintId}` },
      { id: "process", label: "工程表", icon: Wrench, href: `/blueprints/${blueprintId}/process` },
      { id: "project", label: "案件", icon: Users, href: `/blueprints/${blueprintId}/project` },
    ]
  },
  {
    category: "書類関係", 
    items: [
      { id: "quotation", label: "見積書", icon: Calculator, href: `/blueprints/${blueprintId}/quotation` },
      { id: "order", label: "受注書", icon: ShoppingCart, href: `/blueprints/${blueprintId}/order` },
      { id: "delivery", label: "納品書", icon: Truck, href: `/blueprints/${blueprintId}/delivery` },
      { id: "inspection", label: "検査成績書", icon: CheckCircle, href: `/blueprints/${blueprintId}/inspection` },
      { id: "specification", label: "仕様書", icon: Settings, href: `/blueprints/${blueprintId}/specification` },
    ]
  }
];

export default function BlueprintSidebar({ sections, activeTab, onTabChange, headerContent }: BlueprintSidebarProps) {
  return (
    <div className="w-64 h-[calc(100vh-45px)] fixed left-0 top-[45px] bg-white border-r border-gray-200 flex-shrink-0 z-10 shadow-lg">
      <div className="p-4 space-y-6 h-full overflow-y-auto">
        {/* ��������� */}
        {headerContent && (
          <div className="pb-4 border-b border-gray-200">
            {headerContent}
          </div>
        )}

        {/* �Ӳ���� */}
        <nav className="space-y-4">
          {sections.map((section) => (
            <div key={section.category}>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  const className = `w-full flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-gray-700 hover:bg-gray-100"
                  }`;

                  if (item.href) {
                    return (
                      <Link key={item.id} href={item.href} className={className}>
                        <Icon className="h-4 w-4 mr-3" />
                        {item.label}
                      </Link>
                    );
                  }

                  return (
                    <button
                      key={item.id}
                      onClick={() => onTabChange(item.id)}
                      className={className}
                    >
                      <Icon className="h-4 w-4 mr-3" />
                      {item.label}
                    </button>
                  );
                })}
              </div>
              {section !== sections[sections.length - 1] && (
                <Separator className="mt-4" />
              )}
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
}