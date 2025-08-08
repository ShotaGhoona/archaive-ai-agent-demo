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
    icon: <FileText className="h-4 w-4" />, 
    description: "案件の基本情報" 
  },
  { 
    id: "blueprint", 
    label: "図面", 
    href: (id) => `/project/${id}/blueprint`,
    icon: <FileText className="h-4 w-4" />, 
    description: "設計図面・CADデータ" 
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
    id: "inspection", 
    label: "検査成績書", 
    href: (id) => `/project/${id}/inspection`,
    icon: <ClipboardCheck className="h-4 w-4" />, 
    description: "品質検査結果" 
  },
  { 
    id: "shipping", 
    label: "送り状", 
    href: (id) => `/project/${id}/shipping`,
    icon: <Send className="h-4 w-4" />, 
    description: "配送伝票" 
  },
  { 
    id: "specification", 
    label: "仕様書", 
    href: (id) => `/project/${id}/specification`,
    icon: <FileSearch className="h-4 w-4" />, 
    description: "製品仕様書" 
  },
  { 
    id: "invoice", 
    label: "請求書", 
    href: (id) => `/project/${id}/invoice`,
    icon: <CreditCard className="h-4 w-4" />, 
    description: "代金請求書類" 
  },
  { 
    id: "outsource-quotation", 
    label: "外注見積書", 
    href: (id) => `/project/${id}/outsource-quotation`,
    icon: <Building className="h-4 w-4" />, 
    description: "外注業者見積もり" 
  },
  { 
    id: "outsource-delivery", 
    label: "外注納品書", 
    href: (id) => `/project/${id}/outsource-delivery`,
    icon: <Package className="h-4 w-4" />, 
    description: "外注業者納品書" 
  },
  { 
    id: "3d-model", 
    label: "3Dモデル", 
    href: (id) => `/project/${id}/3d-model`,
    icon: <Box className="h-4 w-4" />, 
    description: "3次元モデルデータ" 
  },
  { 
    id: "others", 
    label: "その他", 
    href: (id) => `/project/${id}/others`,
    icon: <FolderOpen className="h-4 w-4" />, 
    description: "その他の関連書類" 
  }
];