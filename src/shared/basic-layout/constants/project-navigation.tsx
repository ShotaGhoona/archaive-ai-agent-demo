import { 
  Info, 
  Receipt, 
  ShoppingCart, 
  Truck, 
  Send, 
  PenTool
} from "lucide-react";

export interface BlueprintDetailTab {
  id: string;
  label: string;
  href: (blueprintId: string) => string;
  icon: React.ReactElement;
  description: string;
}

export const blueprintDetailTabs: BlueprintDetailTab[] = [
  { 
    id: "basic-information", 
    label: "基本情報", 
    href: (id) => `/project/${id}/basic-information`,
    icon: <Info className="h-4 w-4" />, 
    description: "案件の基本情報" 
  },
  { 
    id: "blueprint-register", 
    label: "図面登録", 
    href: (id) => `/project/${id}/blueprint-register`,
    icon: <PenTool className="h-4 w-4" />, 
    description: "図面の新規登録・アップロード" 
  },  
  { 
    id: "quotation", 
    label: "見積書", 
    href: (id) => `/project/${id}/quotation`,
    icon: <Receipt className="h-4 w-4" />, 
    description: "価格見積もり書類" 
  },
  { 
    id: "order", 
    label: "受注書", 
    href: (id) => `/project/${id}/order`,
    icon: <ShoppingCart className="h-4 w-4" />, 
    description: "受注確認書類" 
  },
  { 
    id: "delivery", 
    label: "納品書", 
    href: (id) => `/project/${id}/delivery`,
    icon: <Truck className="h-4 w-4" />, 
    description: "納品完了書類" 
  },
  { 
    id: "invoice", 
    label: "請求書", 
    href: (id) => `/project/${id}/invoice`,
    icon: <Receipt className="h-4 w-4" />, 
    description: "請求書類" 
  },
  { 
    id: "shipping", 
    label: "送り状", 
    href: (id) => `/project/${id}/shipping`,
    icon: <Send className="h-4 w-4" />, 
    description: "配送伝票" 
  }
];