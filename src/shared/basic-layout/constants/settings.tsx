import { 
  User, 
  Bell, 
  Palette, 
  Key,
  Building2,
  Users,
  CreditCard,
  Globe,
  Zap,
  Mail,
  Lock,
  Monitor,
  Download,
  Webhook,
  Settings
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
    id: "personal",
    title: "個人設定",
    icon: <User className="w-5 h-5" />,
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
      }
    ]
  },
  {
    id: "organization",
    title: "組織管理",
    icon: <Building2 className="w-5 h-5" />,
    items: [
      {
        id: "org-settings",
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
      }
    ]
  },
  {
    id: "preferences",
    title: "環境設定",
    icon: <Settings className="w-5 h-5" />,
    items: [
      {
        id: "general",
        label: "一般",
        icon: <Settings className="w-4 h-4" />,
        href: "/setting/general"
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
    id: "developer",
    title: "開発者向け",
    icon: <Key className="w-5 h-5" />,
    items: [
      {
        id: "api-keys",
        label: "APIキー",
        icon: <Key className="w-4 h-4" />,
        href: "/setting/api-keys"
      },
      {
        id: "webhooks",
        label: "Webhook",
        icon: <Webhook className="w-4 h-4" />,
        href: "/setting/webhooks"
      },
      {
        id: "integrations",
        label: "インテグレーション",
        icon: <Globe className="w-4 h-4" />,
        href: "/setting/integrations"
      },
      {
        id: "import-export",
        label: "インポート/エクスポート",
        icon: <Download className="w-4 h-4" />,
        href: "/setting/import-export"
      }
    ]
  }
];

export const appInfo = {
  version: "1.0.0",
  copyright: "© 2024 ARCHAIVE"
};