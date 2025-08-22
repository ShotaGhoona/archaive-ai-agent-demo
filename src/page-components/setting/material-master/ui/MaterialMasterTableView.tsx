import React from "react";
import { TableView } from "@/shared/view/table-view";
import { MaterialMaster, MATERIAL_MASTER_COLUMNS } from "../lib/materialMasterColumns";

interface MaterialMasterTableViewProps {
  materialMasters: MaterialMaster[];
  onMaterialMasterUpdate?: (id: string, field: string, value: unknown) => void;
  currentPage?: number;
  totalItems?: number;
  itemsPerPage?: number;
  onPageChange?: (page: number) => void;
}

export function MaterialMasterTableView({ 
  materialMasters, 
  onMaterialMasterUpdate,
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange
}: MaterialMasterTableViewProps) {
  const paginationConfig = currentPage && totalItems && itemsPerPage && onPageChange ? {
    enabled: true,
    currentPage,
    itemsPerPage,
    totalItems,
    onPageChange,
    showTotalItems: true,
  } : undefined;

  return (
    <TableView
      data={materialMasters}
      columns={MATERIAL_MASTER_COLUMNS}
      onItemUpdate={onMaterialMasterUpdate}
      getRowId={(materialMaster) => materialMaster.id}
      emptyMessage="材料マスターデータがありません"
      pagination={paginationConfig}
    />
  );
}