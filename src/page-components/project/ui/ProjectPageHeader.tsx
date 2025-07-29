import {
  Button,
  Input,
} from "@/shared/shadcnui";
import {
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { ProjectCsvExportDialog } from "./ProjectCsvExportDialog";

interface ProjectPageHeaderProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  onToggleFilterSidebar: () => void;
  isFilterSidebarOpen: boolean;
  projects?: any[];
}

export function ProjectPageHeader({
  searchTerm,
  setSearchTerm,
  onToggleFilterSidebar,
  isFilterSidebarOpen,
  projects = [],
}: ProjectPageHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
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
            placeholder="案件ID、顧客名、担当者、ステータスで検索"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 w-96 h-10 text-base"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        {/* CSV出力ボタン */}
        <ProjectCsvExportDialog projects={projects} />
      </div>
    </div>
  );
}