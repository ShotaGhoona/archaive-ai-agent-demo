import { 
  User, 
  Bell, 
  Palette,
  Building2,
  Users,
  CreditCard,
  Zap,
  Mail,
  Lock,
  Monitor,
  Settings,
  Package,
  GitBranch,
  Database,
  HardDrive
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
  icon: React.ReactNode;
  items: SettingItem[];
}

export const settingSections: SettingSection[] = [
  {
    id: "basic",
    title: "基本設定",
    icon: <Settings className="w-5 h-5" />,
    items: [
      {
        id: "profile",
        label: "プロフィール",
        icon: <User className="w-4 h-4" />,
        href: "/setting/profile"
      },
      {
        id: "account-security",
        label: "アカウントセキュリティ",
        icon: <Lock className="w-4 h-4" />,
        href: "/setting/security"
      },
      {
        id: "notifications",
        label: "通知設定",
        icon: <Bell className="w-4 h-4" />,
        href: "/setting/notifications"
      },
      {
        id: "email",
        label: "メール設定",
        icon: <Mail className="w-4 h-4" />,
        href: "/setting/email"
      },
      {
        id: "organization",
        label: "組織情報",
        icon: <Building2 className="w-4 h-4" />,
        href: "/setting/organization"
      },
      {
        id: "members",
        label: "メンバー管理",
        icon: <Users className="w-4 h-4" />,
        href: "/setting/members"
      },
      {
        id: "billing",
        label: "請求・支払い",
        icon: <CreditCard className="w-4 h-4" />,
        href: "/setting/billing"
      },
      {
        id: "appearance",
        label: "外観",
        icon: <Palette className="w-4 h-4" />,
        href: "/setting/appearance"
      },
      {
        id: "display",
        label: "表示",
        icon: <Monitor className="w-4 h-4" />,
        href: "/setting/display"
      },
      {
        id: "shortcuts",
        label: "ショートカット",
        icon: <Zap className="w-4 h-4" />,
        href: "/setting/shortcuts"
      }
    ]
  },
  {
    id: "master",
    title: "マスター設定",
    icon: <Package className="w-5 h-5" />,
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
    icon: <Database className="w-5 h-5" />,
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
  }
];

export const appInfo = {
  version: "1.0.0",
  copyright: "© 2024 ARCHAIVE"
};