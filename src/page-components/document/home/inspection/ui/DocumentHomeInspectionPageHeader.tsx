import { INSPECTION_CSV_COLUMNS } from "../lib";
import { Inspection } from "../model";
import { SearchInput, CsvExportDialog, FilterToggleButton } from "@/shared";

interface InspectionPageHeaderProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  onToggleFilterSidebar: () => void;
  isFilterSidebarOpen: boolean;
  inspections?: Inspection[];
}

export function DocumentHomeInspectionPageHeader({
  searchTerm,
  setSearchTerm,
  onToggleFilterSidebar,
  isFilterSidebarOpen,
  inspections = [],
}: InspectionPageHeaderProps) {
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
          placeholder="検査表名・プロジェクト名で検索"
        />
      </div>
      <div className="flex items-center gap-3">
        <CsvExportDialog
          data={inspections}
          initialColumns={INSPECTION_CSV_COLUMNS}
          defaultFilename="inspections"
        />
      </div>
    </div>
  );
}