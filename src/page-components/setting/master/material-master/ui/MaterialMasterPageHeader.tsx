import React from "react";
import { SearchInput, CsvExportDialog } from "@/shared";
import { MaterialMaster, MATERIAL_MASTER_CSV_COLUMNS } from "../lib";
import { CreateMaterialDialog } from "../ui";

interface MaterialMasterPageHeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onToggleFilterSidebar?: () => void;
  isFilterSidebarOpen?: boolean;
  materialMasters: MaterialMaster[];
  onMaterialMasterCreate?: (materialMaster: Omit<MaterialMaster, 'id' | 'updatedAt'>) => void;
}

export const MaterialMasterPageHeader: React.FC<MaterialMasterPageHeaderProps> = ({
  searchTerm,
  setSearchTerm,
  materialMasters,
  onMaterialMasterCreate,
}) => {
  const handleMaterialMasterCreate = (materialMaster: Omit<MaterialMaster, 'id' | 'updatedAt'>) => {
    onMaterialMasterCreate?.(materialMaster);
  };

  return (
    <div className="flex items-center justify-between space-x-4">
        <div className="flex-1 max-w-md">
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="材料名、カテゴリ、仕入れ先で検索..."
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <CsvExportDialog
            data={materialMasters as MaterialMaster[]}
            initialColumns={MATERIAL_MASTER_CSV_COLUMNS}
            defaultFilename="material-masters"
          />
          <CreateMaterialDialog 
          onSubmit={handleMaterialMasterCreate} />
        </div>
    </div>
  );
};