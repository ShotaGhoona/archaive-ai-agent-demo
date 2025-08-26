import React from "react";
import { TableView } from "@/shared/view/table-view";
import { MaterialMaster, createMaterialMasterTableConfig } from "../lib";

interface MaterialMasterTableViewProps {
  materialMasters: MaterialMaster[];
  onMaterialMasterUpdate?: (id: string, field: string, value: unknown) => void;
}

export function MaterialMasterTableView({ 
  materialMasters, 
  onMaterialMasterUpdate
}: MaterialMasterTableViewProps) {
  const tableConfig = createMaterialMasterTableConfig();

  return (
    <TableView
      data={materialMasters}
      config={tableConfig}
      onItemUpdate={onMaterialMasterUpdate}
      getRowId={(materialMaster) => materialMaster.id}
    />
  );
}