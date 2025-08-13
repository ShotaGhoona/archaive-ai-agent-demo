import React from "react";
import { SearchInput } from "@/shared/GenericSearch";
import { ProcessMaster } from "../lib/processMasterColumns";
import { CreateProcessDialog } from "./CreateProcessDialog";
import { CsvExportDialog } from "@/features/csv-export";
import { PROCESS_MASTER_CSV_COLUMNS } from "../lib/processMasterCsvConfig";

interface ProcessMasterPageHeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onToggleFilterSidebar?: () => void;
  isFilterSidebarOpen?: boolean;
  processMasters: ProcessMaster[];
  onProcessMasterCreate?: (processMaster: Omit<ProcessMaster, 'id' | 'updatedAt'>) => void;
}

export const ProcessMasterPageHeader: React.FC<ProcessMasterPageHeaderProps> = ({
  searchTerm,
  setSearchTerm,
  processMasters,
  onProcessMasterCreate,
}) => {
  const handleProcessMasterCreate = (processMaster: Omit<ProcessMaster, 'id' | 'updatedAt'>) => {
    onProcessMasterCreate?.(processMaster);
  };

  return (
    <div className="flex items-center justify-between space-x-4">
        <div className="flex-1 max-w-md">
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="工程名、分類、カスタム式で検索..."
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <CsvExportDialog
            data={processMasters as ProcessMaster[]}
            initialColumns={PROCESS_MASTER_CSV_COLUMNS}
            defaultFilename="process-masters"
          />
          <CreateProcessDialog 
          onSubmit={handleProcessMasterCreate} />
        </div>
    </div>
  );
};