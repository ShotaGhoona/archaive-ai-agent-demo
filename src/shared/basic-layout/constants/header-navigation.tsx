import { Users, Settings, Briefcase, PenTool, FileText } from "lucide-react";

export const headerNavigations = [
  {
    label: "図面管理",
    href: "/blueprint",
    icon: <PenTool className="w-4 h-4" />
  },
  {
    label: "案件管理",
    href: "/project",
    icon: <Briefcase className="w-4 h-4" />
  },
  {
    label: "帳票管理",
    href: "/document",
    icon: <FileText className="w-4 h-4" />
  },
  {
    label: "顧客管理",
    href: "/customer",
    icon: <Users className="w-4 h-4" />
  },
  {
    label: "設定画面",
    href: "/setting",
    icon: <Settings className="w-4 h-4" />
  }
];

export const defaultUser = {
  name: "田中 太郎",
  email: "tanaka@example.com",
  avatar: null
};