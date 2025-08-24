import { 
  User, 
  Building2,
  Users,
  FileText,
  Lock,
  Settings,
  Package,
  GitBranch,
  Database,
  HardDrive,
  ScrollText
} from "lucide-react";

export interface SettingItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
}

export interface SettingSection {
  id: string;
  title: string;
  items: SettingItem[];
}

export const settingSections: SettingSection[] = [
  {
    id: "basic",
    title: "基本設定",
    items: [
      {
        id: "profile",
        label: "プロフィール",
        icon: <User className="w-4 h-4" />,
        href: "/setting/profile"
      },
      {
        id: "company-info",
        label: "自社情報設定",
        icon: <Building2 className="w-4 h-4" />,
        href: "/setting/company-info"
      },
      {
        id: "customer-list",
        label: "顧客リスト",
        icon: <Users className="w-4 h-4" />,
        href: "/setting/customer-list"
      },
      {
        id: "reports",
        label: "帳票設定",
        icon: <FileText className="w-4 h-4" />,
        href: "/setting/reports"
      },
      {
        id: "security",
        label: "セキュリティ設定",
        icon: <Lock className="w-4 h-4" />,
        href: "/setting/security"
      }
    ]
  },
  {
    id: "master",
    title: "マスター設定",
    items: [
      {
        id: "material-master",
        label: "材料マスター設定",
        icon: <Package className="w-4 h-4" />,
        href: "/setting/material-master"
      },
      {
        id: "process-master",
        label: "工程マスター設定",
        icon: <GitBranch className="w-4 h-4" />,
        href: "/setting/process-master"
      }
    ]
  },
  {
    id: "database",
    title: "データベース設定",
    items: [
      {
        id: "drawing-database",
        label: "図面データベース設定",
        icon: <HardDrive className="w-4 h-4" />,
        href: "/setting/drawing-database"
      },
      {
        id: "project-database",
        label: "案件データベース設定",
        icon: <Database className="w-4 h-4" />,
        href: "/setting/project-database"
      },
      {
        id: "customer-database",
        label: "顧客データベース設定",
        icon: <Database className="w-4 h-4" />,
        href: "/setting/customer-database"
      }
    ]
  },
  {
    id: "other",
    title: "その他",
    items: [
      {
        id: "terms-of-service",
        label: "サービス利用規約",
        icon: <ScrollText className="w-4 h-4" />,
        href: "/setting/terms-of-service"
      }
    ]
  }
];

export const appInfo = {
  version: "1.0.0",
  copyright: "© 2024 ARCHAIVE"
};