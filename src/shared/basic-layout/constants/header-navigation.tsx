import { FileText, Users, Settings } from "lucide-react";

export const headerNavigations = [
  {
    label: "v2.1",
    href: "/v2",
    icon: <FileText className="w-4 h-4" />
  },
  {
    label: "図面管理",
    href: "/blueprint",
    icon: <FileText className="w-4 h-4" />
  },
  {
    label: "案件管理",
    href: "/project",
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