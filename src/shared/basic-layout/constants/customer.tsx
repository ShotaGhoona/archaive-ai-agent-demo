import { 
  User, 
  Phone, 
  FileText, 
  MessageSquare
} from "lucide-react";

export interface CustomerMenuItem {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
}

export const customerMenuItems: CustomerMenuItem[] = [
  {
    id: "profile",
    label: "基本情報",
    href: "/customer/[id]/profile",
    icon: <User className="w-4 h-4" />
  },
  {
    id: "contact",
    label: "連絡先リスト",
    href: "/customer/[id]/contact",
    icon: <Phone className="w-4 h-4" />
  },
  {
    id: "project",
    label: "案件履歴",
    href: "/customer/[id]/project",
    icon: <FileText className="w-4 h-4" />
  },
  {
    id: "notes",
    label: "メモ・備考",
    href: "/customer/[id]/notes",
    icon: <MessageSquare className="w-4 h-4" />
  }
];

export const customerInfo = {
  title: "顧客詳細",
  version: "1.0.0"
};