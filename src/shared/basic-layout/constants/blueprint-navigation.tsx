import { 
  FileText, 
  Search, 
  Calculator, 
  BookOpen, 
  Box
} from "lucide-react";

export interface BlueprintTab {
  id: string;
  label: string;
  href: (blueprintId: string) => string;
  icon: React.ReactElement;
  description: string;
}

export const blueprintTabs: BlueprintTab[] = [
  { 
    id: "basic-information", 
    label: "図面基本情報", 
    href: (blueprintId) => `/blueprint/${blueprintId}/basic-information`,
    icon: <FileText className="h-4 w-4" />, 
    description: "図面の基本情報と詳細データ" 
  },
  { 
    id: "similar-blueprints", 
    label: "類似図面", 
    href: (blueprintId) => `/blueprint/${blueprintId}/similar`,
    icon: <Search className="h-4 w-4" />, 
    description: "類似する図面の検索と比較" 
  },
  { 
    id: "estimate", 
    label: "見積もり計算", 
    href: (blueprintId) => `/blueprint/${blueprintId}/estimate`,
    icon: <Calculator className="h-4 w-4" />, 
    description: "コスト見積もりと価格計算" 
  },
  { 
    id: "specification", 
    label: "仕様書", 
    href: (blueprintId) => `/blueprint/${blueprintId}/specification`,
    icon: <BookOpen className="h-4 w-4" />, 
    description: "技術仕様書と製品要件" 
  },
  { 
    id: "3d-model", 
    label: "3Dモデル", 
    href: (blueprintId) => `/blueprint/${blueprintId}/3d-model`,
    icon: <Box className="h-4 w-4" />, 
    description: "3次元モデルデータとビューア" 
  }
];