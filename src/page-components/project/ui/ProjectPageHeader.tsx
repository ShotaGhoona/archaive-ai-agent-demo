import { FilterToggleButton } from "@/features/advanced-filter";
import { CsvExportDialog } from "@/features/csv-export";
import { PROJECT_CSV_COLUMNS } from "../lib/projectCsvConfig";
import { NewProjectDialog } from "./NewProjectDialog";
import { Project } from "../lib/projectColumns";
import { SearchInput } from "@/shared/GenericSearch";

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
        {/* 新規案件登録ボタン */}
        <NewProjectDialog
          onSubmit={handleProjectCreate}
        />
      </div>
    </div>
  );
}