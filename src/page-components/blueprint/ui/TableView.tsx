import React from "react";
import { BasicDataTable } from "@/shared/basic-data-table";
import { Blueprint, BLUEPRINT_COLUMNS } from "../lib/blueprintColumns";

interface TableViewProps {
  blueprints: Blueprint[];
  onBlueprintUpdate?: (internalNumber: string, field: string, value: any) => void;
}

export function TableView({ blueprints, onBlueprintUpdate }: TableViewProps) {
  return (
    <BasicDataTable
      data={blueprints}
      columns={BLUEPRINT_COLUMNS}
      onItemUpdate={onBlueprintUpdate}
      getRowId={(blueprint) => blueprint.internalNumber}
      emptyMessage="図面データがありません"
    />
  );
}