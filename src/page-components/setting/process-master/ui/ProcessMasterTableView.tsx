import React from "react";
import { TableView } from "@/shared";
import { ProcessMaster, PROCESS_MASTER_COLUMNS } from "../lib";

interface ProcessMasterTableViewProps {
  processMasters: ProcessMaster[];
  onProcessMasterUpdate?: (id: string, field: string, value: unknown) => void;
  currentPage?: number;
  totalItems?: number;
  itemsPerPage?: number;
  onPageChange?: (page: number) => void;
}

export function ProcessMasterTableView({ 
  processMasters, 
  onProcessMasterUpdate,
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange
}: ProcessMasterTableViewProps) {
  const paginationConfig = currentPage && totalItems && itemsPerPage && onPageChange ? {
    enabled: true,
    currentPage,
    itemsPerPage,
    totalItems,
    onPageChange,
  } : undefined;

  return (
    <TableView
      data={processMasters}
      columns={PROCESS_MASTER_COLUMNS}
      onItemUpdate={onProcessMasterUpdate}
      getRowId={(processMaster) => processMaster.id}
      pagination={paginationConfig}
    />
  );
}