import {
  Button,
  Input,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui";
import {
  Search,
  Filter,
  RefreshCw,
  Download,
  Grid3X3,
  List,
  SlidersHorizontal,
} from "lucide-react";
import { SimilarBlueprintSearchDialog } from "./SimilarBlueprintSearchDialog";
import { CsvExportDialog } from "./CsvExportDialog";
import { BlueprintUploadDialog } from "./BlueprintUploadDialog";

interface BlueprintPageHeaderProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedFilter: string;
  setSelectedFilter: (value: string) => void;
  viewMode: "table" | "gallery";
  setViewMode: (mode: "table" | "gallery") => void;
  onToggleFilterSidebar: () => void;
  isFilterSidebarOpen: boolean;
  blueprints?: any[];
}

export function BlueprintPageHeader({
  searchTerm,
  setSearchTerm,
  selectedFilter,
  setSelectedFilter,
  viewMode,
  setViewMode,
  onToggleFilterSidebar,
  isFilterSidebarOpen,
  blueprints = [],
}: BlueprintPageHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1 border border-gray-200 rounded-lg bg-background">
          <Button
            variant={viewMode === "table" ? "default" : "ghost"}
            size="lg"
            onClick={() => setViewMode("table")}
            className="h-10 w-10 p-0"
          >
            <List className="h-5 w-5" />
          </Button>
          <Button
            variant={viewMode === "gallery" ? "default" : "ghost"}
            size="lg"
            onClick={() => setViewMode("gallery")}
            className="h-10 w-10 p-0"
          >
            <Grid3X3 className="h-5 w-5" />
          </Button>
        </div>
        <Button
          variant={isFilterSidebarOpen ? "default" : "outline"}
          size="lg"
          onClick={onToggleFilterSidebar}
        >
          <SlidersHorizontal className="h-5 w-5 mr-2" />
          詳細フィルター
        </Button>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            placeholder="ファイル名、発注元、製品名、整番で検索"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 w-90 h-10 text-base"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        {/* CSV出力ボタン */}
        <CsvExportDialog blueprints={blueprints} />
        {/* 類似図面検索 */}
        <SimilarBlueprintSearchDialog />

        {/* 新規図面登録ボタン */}
        <BlueprintUploadDialog />
      </div>
    </div>
  );
}