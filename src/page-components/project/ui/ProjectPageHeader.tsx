import {
  Input,
} from "@/shared/shadcnui";
import {
  Search,
} from "lucide-react";
import { FilterToggleButton } from "@/features/advanced-filter";
import { CsvExportDialog } from "@/features/csv-export";
import { PROJECT_CSV_COLUMNS } from "../lib/projectCsvConfig";
import { NewProjectDialog } from "./NewProjectDialog";
import { Project } from "../lib/projectColumns";

interface ProjectPageHeaderProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  onToggleFilterSidebar: () => void;
  isFilterSidebarOpen: boolean;
  projects?: unknown[];
  onProjectCreate?: (project: Omit<Project, 'projectId' | 'lastUpdatedBy' | 'lastUpdatedAt'>) => void;
}

export function ProjectPageHeader({
  searchTerm,
  setSearchTerm,
  onToggleFilterSidebar,
  isFilterSidebarOpen,
  projects = [],
  onProjectCreate,
}: ProjectPageHeaderProps) {
  const handleProjectCreate = (project: Omit<Project, 'projectId' | 'lastUpdatedBy' | 'lastUpdatedAt'>) => {
    onProjectCreate?.(project);
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <FilterToggleButton
          isOpen={isFilterSidebarOpen}
          onToggle={onToggleFilterSidebar}
        />
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
      <div className="flex items-center gap-3">
        {/* CSV出力ボタン */}
        <CsvExportDialog
          data={projects as Project[]}
          initialColumns={PROJECT_CSV_COLUMNS}
          defaultFilename="projects"
        />
        {/* 新規案件登録ボタン */}
        <NewProjectDialog
          onSubmit={handleProjectCreate}
        />
      </div>
    </div>
  );
}