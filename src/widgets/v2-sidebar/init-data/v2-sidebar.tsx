import { Folder, FileText, Package, Wrench, Calculator, Truck, ClipboardCheck } from "lucide-react";
import { FaFolder } from "react-icons/fa";
import { V2SidebarItem, ItemTypeOption, IconColorOption } from "../model/types";

export const defaultV2SidebarData: V2SidebarItem[] = [
  {
    id: "1",
    name: "製品A",
    type: "folder",
    icon: <FaFolder className="w-4 h-4" />,
    iconColor: "text-blue-600",
    children: [
      {
        id: "1-1",
        name: "基本情報",
        type: "project-info",
        icon: <Package className="w-4 h-4" />,
        iconColor: "text-green-600",
        parentId: "1"
      },
      {
        id: "1-2",
        name: "図面一覧",
        type: "blueprint",
        icon: <FileText className="w-4 h-4" />,
        iconColor: "text-purple-600",
        parentId: "1"
      },
      {
        id: "1-3",
        name: "見積書",
        type: "quotation",
        icon: <Calculator className="w-4 h-4" />,
        iconColor: "text-orange-600",
        parentId: "1"
      },
      {
        id: "1-4",
        name: "パーツ",
        type: "folder",
        icon: <FaFolder className="w-4 h-4" />,
        iconColor: "text-yellow-600",
        parentId: "1",
        children: [
          {
            id: "1-4-1",
            name: "パーツA図面",
            type: "blueprint",
            icon: <FileText className="w-4 h-4" />,
            iconColor: "text-purple-600",
            parentId: "1-4"
          },
          {
            id: "1-4-2",
            name: "パーツB図面",
            type: "blueprint",
            icon: <FileText className="w-4 h-4" />,
            iconColor: "text-purple-600",
            parentId: "1-4"
          },
          {
            id: "1-4-3",
            name: "検査記録",
            type: "inspection",
            icon: <ClipboardCheck className="w-4 h-4" />,
            iconColor: "text-red-600",
            parentId: "1-4"
          }
        ]
      }
    ]
  },
  {
    id: "2",
    name: "製品B",
    type: "folder",
    icon: <FaFolder className="w-4 h-4" />,
    iconColor: "text-blue-600",
    children: [
      {
        id: "2-1",
        name: "基本情報",
        type: "project-info",
        icon: <Package className="w-4 h-4" />,
        iconColor: "text-green-600",
        parentId: "2"
      },
      {
        id: "2-2",
        name: "図面一覧",
        type: "blueprint",
        icon: <FileText className="w-4 h-4" />,
        iconColor: "text-purple-600",
        parentId: "2"
      },
      {
        id: "2-3",
        name: "納期管理",
        type: "delivery",
        icon: <Truck className="w-4 h-4" />,
        iconColor: "text-red-600",
        parentId: "2"
      }
    ]
  },
  {
    id: "3",
    name: "顧客別案件",
    type: "folder",
    icon: <FaFolder className="w-4 h-4" />,
    iconColor: "text-blue-600",
    children: [
      {
        id: "3-1",
        name: "A社案件",
        type: "folder",
        icon: <FaFolder className="w-4 h-4" />,
        iconColor: "text-indigo-600",
        parentId: "3",
        children: [
          {
            id: "3-1-1",
            name: "図面",
            type: "blueprint",
            icon: <FileText className="w-4 h-4" />,
            iconColor: "text-purple-600",
            parentId: "3-1"
          },
          {
            id: "3-1-2",
            name: "納期管理",
            type: "delivery",
            icon: <Truck className="w-4 h-4" />,
            iconColor: "text-red-600",
            parentId: "3-1"
          },
          {
            id: "3-1-3",
            name: "見積書",
            type: "quotation",
            icon: <Calculator className="w-4 h-4" />,
            iconColor: "text-orange-600",
            parentId: "3-1"
          }
        ]
      },
      {
        id: "3-2",
        name: "B社案件",
        type: "folder",
        icon: <FaFolder className="w-4 h-4" />,
        iconColor: "text-indigo-600",
        parentId: "3",
        children: [
          {
            id: "3-2-1",
            name: "基本情報",
            type: "project-info",
            icon: <Package className="w-4 h-4" />,
            iconColor: "text-green-600",
            parentId: "3-2"
          },
          {
            id: "3-2-2",
            name: "図面",
            type: "blueprint",
            icon: <FileText className="w-4 h-4" />,
            iconColor: "text-purple-600",
            parentId: "3-2"
          }
        ]
      }
    ]
  },
  {
    id: "4",
    name: "カスタムワークフロー",
    type: "folder",
    icon: <FaFolder className="w-4 h-4" />,
    iconColor: "text-purple-600",
    children: [
      {
        id: "4-1",
        name: "プロセス1",
        type: "custom",
        icon: <Wrench className="w-4 h-4" />,
        iconColor: "text-gray-600",
        parentId: "4"
      },
      {
        id: "4-2",
        name: "プロセス2",
        type: "custom",
        icon: <Wrench className="w-4 h-4" />,
        iconColor: "text-gray-600",
        parentId: "4"
      }
    ]
  }
];

export const itemTypeOptions: ItemTypeOption[] = [
  {
    value: 'folder',
    label: 'フォルダ',
    icon: <FaFolder className="w-4 h-4" />,
    description: '階層を作成してアイテムをグループ化'
  },
  {
    value: 'blueprint',
    label: '図面ページ',
    icon: <FileText className="w-4 h-4" />,
    description: '図面の管理と表示'
  },
  {
    value: 'project-info',
    label: '案件基本情報',
    icon: <Package className="w-4 h-4" />,
    description: 'プロジェクトの基本情報を管理'
  },
  {
    value: 'quotation',
    label: '見積書',
    icon: <Calculator className="w-4 h-4" />,
    description: '見積書の作成と管理'
  },
  {
    value: 'delivery',
    label: '納期管理',
    icon: <Truck className="w-4 h-4" />,
    description: '納期とスケジュールの管理'
  },
  {
    value: 'inspection',
    label: '検査記録',
    icon: <ClipboardCheck className="w-4 h-4" />,
    description: '品質検査の記録と管理'
  },
  {
    value: 'custom',
    label: 'カスタムページ',
    icon: <Wrench className="w-4 h-4" />,
    description: '独自のページを作成'
  }
];

export const iconColorOptions: IconColorOption[] = [
  { value: 'text-blue-600', label: 'ブルー', color: 'bg-blue-600' },
  { value: 'text-green-600', label: 'グリーン', color: 'bg-green-600' },
  { value: 'text-purple-600', label: 'パープル', color: 'bg-purple-600' },
  { value: 'text-orange-600', label: 'オレンジ', color: 'bg-orange-600' },
  { value: 'text-red-600', label: 'レッド', color: 'bg-red-600' },
  { value: 'text-yellow-600', label: 'イエロー', color: 'bg-yellow-600' },
  { value: 'text-indigo-600', label: 'インディゴ', color: 'bg-indigo-600' },
  { value: 'text-pink-600', label: 'ピンク', color: 'bg-pink-600' },
  { value: 'text-gray-600', label: 'グレー', color: 'bg-gray-600' }
];