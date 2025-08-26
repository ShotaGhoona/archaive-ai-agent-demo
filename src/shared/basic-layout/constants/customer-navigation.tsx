import { 
  Info, 
  Phone, 
  Briefcase, 
  MessageSquare
} from "lucide-react";

export interface CustomerMenuItem {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
  description: string;
}

export const customerMenuItems: CustomerMenuItem[] = [
  {
    id: "profile",
    label: "基本情報",
    href: "/customer/[id]/profile",
    icon: <Info className="w-4 h-4" />,
    description: "顧客の基本的な情報を管理"
  },
  {
    id: "contact",
    label: "連絡先リスト",
    href: "/customer/[id]/contact",
    icon: <Phone className="w-4 h-4" />,
    description: "顧客の連絡先情報を管理"
  },
  {
    id: "project",
    label: "案件履歴",
    href: "/customer/[id]/project",
    icon: <Briefcase className="w-4 h-4" />,
    description: "過去の案件と進行中のプロジェクト"
  },
  {
    id: "notes",
    label: "メモ・備考",
    href: "/customer/[id]/notes",
    icon: <MessageSquare className="w-4 h-4" />,
    description: "顧客に関するメモや重要な備考"
  }
];

export const customerInfo = {
  title: "顧客詳細",
  version: "1.0.0"
};