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
  href: (projectId: string) => string;
  icon: React.ReactElement;
  description: string;
}

export const blueprintTabs: BlueprintTab[] = [
  { 
    id: "basic-information", 
    label: "図面基本情報", 
    href: (projectId) => `/project/${projectId}/blueprint`,
    icon: <FileText className="h-4 w-4" />, 
    description: "図面の基本情報と詳細データ" 
  },
  { 
    id: "similar-blueprints", 
    label: "類似図面", 
    href: (projectId) => `/project/${projectId}/blueprint/similar`,
    icon: <Search className="h-4 w-4" />, 
    description: "類似する図面の検索と比較" 
  },
  { 
    id: "estimate", 
    label: "見積もり計算", 
    href: (projectId) => `/project/${projectId}/blueprint/estimate`,
    icon: <Calculator className="h-4 w-4" />, 
    description: "コスト見積もりと価格計算" 
  },
  { 
    id: "specification", 
    label: "仕様書", 
    href: (projectId) => `/project/${projectId}/blueprint/specification`,
    icon: <BookOpen className="h-4 w-4" />, 
    description: "技術仕様書と製品要件" 
  },
  { 
    id: "3d-model", 
    label: "3Dモデル", 
    href: (projectId) => `/project/${projectId}/blueprint/3d-model`,
    icon: <Box className="h-4 w-4" />, 
    description: "3次元モデルデータとビューア" 
  }
];