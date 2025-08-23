import { FilterToggleButton, CsvExportDialog } from "@/features";
import { 
  Button, 
  Tooltip, 
  TooltipTrigger, 
  TooltipContent,
  SearchInput,
} from "@/shared";
import { Plus, List, Kanban } from "lucide-react";
import { Project, PROJECT_CSV_COLUMNS } from "../lib";
import Link from "next/link";
import { ProjectBlueprintUploadDialog } from "../ui";

interface ProjectPageHeaderProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  viewMode: "table" | "kanban";
  setViewMode: (mode: "table" | "kanban") => void;
  onToggleFilterSidebar: () => void;
  isFilterSidebarOpen: boolean;
  projects?: unknown[];
}

export function ProjectPageHeader({
  searchTerm,
  setSearchTerm,
  viewMode,
  setViewMode,
  onToggleFilterSidebar,
  isFilterSidebarOpen,
  projects = [],
}: ProjectPageHeaderProps) {

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1 border border-gray-200 rounded-lg bg-background">
          <Tooltip delayDuration={500}>
            <TooltipTrigger asChild>
              <Button
                variant={viewMode === "table" ? "default" : "ghost"}
                size="lg"
                onClick={() => setViewMode("table")}
                className="h-10 w-10 p-0"
              >
                <List className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              テーブルビュー
            </TooltipContent>
          </Tooltip>
          <Tooltip delayDuration={500}>
            <TooltipTrigger asChild>
              <Button
                variant={viewMode === "kanban" ? "default" : "ghost"}
                size="lg"
                onClick={() => setViewMode("kanban")}
                className="h-10 w-10 p-0"
              >
                <Kanban className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              看板ビュー
            </TooltipContent>
          </Tooltip>
        </div>
        <FilterToggleButton
          isOpen={isFilterSidebarOpen}
          onToggle={onToggleFilterSidebar}
        />
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="案件ID、顧客名、担当者、ステータスで検索"
        />
      </div>
      <div className="flex items-center gap-3">
        {/* CSV出力ボタン */}
        <CsvExportDialog
          data={projects as Project[]}
          initialColumns={PROJECT_CSV_COLUMNS}
          defaultFilename="projects"
        />
        <ProjectBlueprintUploadDialog />
        <Link href="/blueprint/upload">
          <Button size="lg" className="bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            一括案件登録
          </Button>
        </Link>
      </div>
    </div>
  );
}