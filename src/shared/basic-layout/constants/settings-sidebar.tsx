import { 
  Building2,
  FileText,
  Lock,
  Database,
  PenTool,
  ScrollText
} from "lucide-react";

export interface SettingItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
  description: string;
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
        id: "company-info",
        label: "自社情報設定",
        icon: <Building2 className="w-4 h-4" />,
        href: "/setting/company-info",
        description: "会社情報、住所、連絡先、ロゴやフォントを設定"
      },
      {
        id: "reports",
        label: "帳票設定",
        icon: <FileText className="w-4 h-4" />,
        href: "/setting/reports",
        description: "請求書や見積書などの帳票設定"
      },
      {
        id: "security",
        label: "セキュリティ設定",
        icon: <Lock className="w-4 h-4" />,
        href: "/setting/security",
        description: "パスワードやアクセス権限の管理"
      }
    ]
  },
  // ver2.1 ではスコープ外
  // {
  //   id: "master",
  //   title: "マスター設定",
  //   items: [
  //     {
  //       id: "material-master",
  //       label: "(材料マスター設定)",
  //       icon: <Package className="w-4 h-4" />,
  //       href: "/setting/material-master",
  //       description: "建材や部品のマスターデータを管理"
  //     },
  //     {
  //       id: "process-master",
  //       label: "(工程マスター設定)",
  //       icon: <GitBranch className="w-4 h-4" />,
  //       href: "/setting/process-master",
  //       description: "工事・製造工程のマスターデータを管理"
  //     }
  //   ]
  // },
  {
    id: "database",
    title: "データベース設定",
    items: [
      {
        id: "drawing-database",
        label: "図面データベース設定",
        icon: <PenTool className="w-4 h-4" />,
        href: "/setting/drawing-database",
        description: "図面テーブルの自由項目設定"
      },
      {
        id: "project-database",
        label: "案件データベース設定",
        icon: <Database className="w-4 h-4" />,
        href: "/setting/project-database",
        description: "案件テーブルの自由項目設定"
      },
      {
        id: "customer-database",
        label: "顧客データベース設定",
        icon: <Database className="w-4 h-4" />,
        href: "/setting/customer-database",
        description: "顧客テーブルの自由項目設定"
      },
      {
        id: "document-database",
        label: "帳票データベース設定",
        icon: <FileText className="w-4 h-4" />,
        href: "/setting/document-database",
        description: "帳票テーブルの自由項目設定"
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
        href: "/setting/terms-of-service",
        description: "サービス利用規約の確認"
      }
    ]
  }
];