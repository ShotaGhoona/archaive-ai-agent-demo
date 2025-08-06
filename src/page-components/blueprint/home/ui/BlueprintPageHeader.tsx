import {
  Button,
} from "@/shared/shadcnui";
import {
  Grid3X3,
  List,
} from "lucide-react";
import { FilterToggleButton } from "@/features/advanced-filter";
import { Blueprint } from "../lib/blueprintColumns";
import { CsvExportDialog } from "@/features/csv-export";
import { SimilarBlueprintSearchDialog } from "./SimilarBlueprintSearchDialog";
import { BlueprintUploadDialog } from "./BlueprintUploadDialog";
import { BLUEPRINT_CSV_COLUMNS } from "../lib/blueprintCsvConfig";
import { SearchInput } from "@/shared/GenericSearch";

interface BlueprintPageHeaderProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedFilter: string;
  setSelectedFilter: (value: string) => void;
  viewMode: "table" | "gallery";
  setViewMode: (mode: "table" | "gallery") => void;
  onToggleFilterSidebar: () => void;
  isFilterSidebarOpen: boolean;
  blueprints?: unknown[];
}

export function BlueprintPageHeader({
  searchTerm,
  setSearchTerm,
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
        <FilterToggleButton
          isOpen={isFilterSidebarOpen}
          onToggle={onToggleFilterSidebar}
        />
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="ファイル名、発注元、製品名、整番で検索"
        />
      </div>
      <div className="flex items-center gap-4">
        {/* CSV出力ボタン */}
        <CsvExportDialog
          data={blueprints as Blueprint[]}
          initialColumns={BLUEPRINT_CSV_COLUMNS}
          defaultFilename="blueprints"
        />
        {/* 類似図面検索 */}
        <SimilarBlueprintSearchDialog />

        {/* 新規図面登録ボタン */}
        <BlueprintUploadDialog />
      </div>
    </div>
  );
}