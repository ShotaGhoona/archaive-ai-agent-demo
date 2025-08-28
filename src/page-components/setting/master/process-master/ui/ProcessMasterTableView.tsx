import React from "react";
import { TableView } from "@/shared/view/table-view";
import { ProcessMaster, createProcessMasterTableConfig } from "../lib";

interface ProcessMasterTableViewProps {
  processMasters: ProcessMaster[];
  onProcessMasterUpdate?: (id: string, field: string, value: unknown) => void;
}

export function ProcessMasterTableView({ 
  processMasters, 
  onProcessMasterUpdate
}: ProcessMasterTableViewProps) {
  const tableConfig = createProcessMasterTableConfig();

  return (
    <TableView
      data={processMasters}
      config={tableConfig}
      onItemUpdate={onProcessMasterUpdate}
      getRowId={(processMaster) => processMaster.id}
    />
  );
}