import { 
  FileText, Package, Wrench, Calculator, ClipboardCheck, 
  FolderOpen, Receipt, ShoppingCart, Send, BookOpen,
  Building2, ShoppingBag, Box
} from "lucide-react";
import { FaFolder } from "react-icons/fa";
import { ItemTypeOption, IconColorOption } from "../model";

export const itemTypeOptions: ItemTypeOption[] = [
  // フォルダ系（優先度高）
  {
    value: 'project-folder',
    label: '案件フォルダ',
    icon: <FolderOpen className="w-4 h-4" />,
    description: '案件に必要なページを自動生成',
    colSpan: 1,
    rowSpan: 2
  },
  {
    value: 'folder',
    label: 'シンプルフォルダ',
    icon: <FaFolder className="w-4 h-4" />,
    description: '空のフォルダを作成',
    colSpan: 1,
    rowSpan: 2
  },
  
  // 基本ページ系（優先度高）
  {
    value: 'blueprint',
    label: '図面ページ',
    icon: <FileText className="w-4 h-4" />,
    description: '図面の管理と表示',
    colSpan: 1,
    rowSpan: 1
  },
  {
    value: 'project-info',
    label: '案件基本情報',
    icon: <Package className="w-4 h-4" />,
    description: 'プロジェクトの基本情報を管理',
    colSpan: 1,
    rowSpan: 1
  },
  
  // 見積・受注系
  {
    value: 'quotation',
    label: '見積書',
    icon: <Calculator className="w-4 h-4" />,
    description: '見積書の作成と管理',
    colSpan: 1,
    rowSpan: 1
  },
  {
    value: 'order',
    label: '受注書',
    icon: <ShoppingCart className="w-4 h-4" />,
    description: '受注書の管理',
    colSpan: 1,
    rowSpan: 1
  },
  
  // 納品・検査系
  {
    value: 'delivery-note',
    label: '納品書',
    icon: <Receipt className="w-4 h-4" />,
    description: '納品書の作成と管理',
    colSpan: 1,
    rowSpan: 1
  },
  {
    value: 'inspection-report',
    label: '検査成績書',
    icon: <ClipboardCheck className="w-4 h-4" />,
    description: '品質検査の記録と管理',
    colSpan: 1,
    rowSpan: 1
  },
  
  // 仕様・送り状系
  {
    value: 'specification',
    label: '仕様書',
    icon: <BookOpen className="w-4 h-4" />,
    description: '製品仕様の管理',
    colSpan: 1,
    rowSpan: 1
  },
  {
    value: 'shipping-label',
    label: '送り状',
    icon: <Send className="w-4 h-4" />,
    description: '送り状の管理',
    colSpan: 1,
    rowSpan: 1
  },
  
  // 外注系
  {
    value: 'outsource-quotation',
    label: '外注見積書',
    icon: <Building2 className="w-4 h-4" />,
    description: '外注業者からの見積書',
    colSpan: 1,
    rowSpan: 1
  },
  {
    value: 'outsource-order',
    label: '外注発注書',
    icon: <ShoppingBag className="w-4 h-4" />,
    description: '外注業者への発注書',
    colSpan: 1,
    rowSpan: 1
  },
  {
    value: 'outsource-delivery',
    label: '外注納品書',
    icon: <Box className="w-4 h-4" />,
    description: '外注業者からの納品書',
    colSpan: 1,
    rowSpan: 1
  },
  
  // 3D・カスタム系
  {
    value: '3d-model',
    label: '3Dモデル',
    icon: <Package className="w-4 h-4" />,
    description: '3Dモデルファイルの管理',
    colSpan: 1,
    rowSpan: 1
  },
  {
    value: 'custom',
    label: 'カスタムページ',
    icon: <Wrench className="w-4 h-4" />,
    description: '独自のページを作成',
    colSpan: 1,
    rowSpan: 1
  }
];

export const iconColorOptions: IconColorOption[] = [
  { value: 'text-primary', label: 'プライマリ（青）', color: 'bg-primary' },
  { value: 'text-secondary', label: 'セカンダリ（赤）', color: 'bg-secondary' },
  { value: 'text-green-600', label: 'グリーン', color: 'bg-green-600' },
  { value: 'text-yellow-500', label: 'イエロー', color: 'bg-yellow-500' },
  { value: 'text-purple-600', label: 'パープル', color: 'bg-purple-600' },
  { value: 'text-orange-600', label: 'オレンジ', color: 'bg-orange-600' },
  { value: 'text-gray-600', label: 'グレー', color: 'bg-gray-600' }
];