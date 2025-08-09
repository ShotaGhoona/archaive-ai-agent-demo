import { FilterToggleButton } from "@/features/advanced-filter";
import { CsvExportDialog } from "@/features/csv-export";
import { PROJECT_CSV_COLUMNS } from "../lib/projectCsvConfig";
import { SearchInput } from "@/shared/GenericSearch";
import { Button } from "@/shared/shadcnui";
import { Plus } from "lucide-react";
import { Project } from "../lib/projectColumns";

interface ProjectPageHeaderProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  onToggleFilterSidebar: () => void;
  isFilterSidebarOpen: boolean;
  projects?: unknown[];
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
        
        <Button size="lg">
          <Plus className="h-4 w-4 mr-2" />
          一括案件登録
        </Button>

        <Button size="lg">
          <Plus className="h-4 w-4 mr-2" />
          個別案件登録
        </Button>
      </div>
    </div>
  );
}