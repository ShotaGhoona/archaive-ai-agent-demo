import { Button } from "@/shared/shadcnui";
import { 
  FileText, 
  Receipt, 
  ShoppingCart, 
  Truck, 
  ClipboardCheck, 
  Send, 
  FileSearch, 
  CreditCard, 
  Building, 
  Package,
  Box,
  FolderOpen
} from "lucide-react";

export interface TabConfig {
  id: string;
  label: string;
  icon: React.ComponentType<unknown>;
  description: string;
}

export const tabs: TabConfig[] = [
  { id: "blueprint", label: "図面", icon: FileText, description: "設計図面・CADデータ" },
  { id: "quotation", label: "見積書", icon: Receipt, description: "価格見積もり書類" },
  { id: "order", label: "受注書", icon: ShoppingCart, description: "受注確認書類" },
  { id: "delivery", label: "納品書", icon: Truck, description: "納品完了書類" },
  { id: "inspection", label: "検査成績書", icon: ClipboardCheck, description: "品質検査結果" },
  { id: "shipping", label: "送り状", icon: Send, description: "配送伝票" },
  { id: "specification", label: "仕様書", icon: FileSearch, description: "製品仕様書" },
  { id: "invoice", label: "請求書", icon: CreditCard, description: "代金請求書類" },
  { id: "outsource-quotation", label: "外注見積書", icon: Building, description: "外注業者見積もり" },
  { id: "outsource-delivery", label: "外注納品書", icon: Package, description: "外注業者納品書" },
  { id: "3d-model", label: "3Dモデル", icon: Box, description: "3次元モデルデータ" },
  { id: "others", label: "その他", icon: FolderOpen, description: "その他の関連書類" }
];

interface DetailTabNavigationProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export function DetailTabNavigation({ activeTab, onTabChange }: DetailTabNavigationProps) {
  return (
    <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        
        return (
          <Button
            key={tab.id}
            variant={isActive ? "default" : "ghost"}
            size="lg"
            onClick={() => onTabChange(tab.id)}
            className={`
              flex-shrink-0 h-12 px-4 gap-2 text-sm font-medium transition-all
              ${isActive 
                ? "bg-primary text-primary-foreground shadow-sm" 
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }
            `}
          >
            <Icon className="h-4 w-4" />
            {tab.label}
          </Button>
        );
      })}
    </div>
  );
}