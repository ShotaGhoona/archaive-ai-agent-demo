"use client";
import { TableView } from "@/shared";
import { createBlueprintColumns, Blueprint } from "@/page-components";

interface BlueprintTableProps {
  blueprints: Blueprint[];
}

export function BlueprintTable({ blueprints }: BlueprintTableProps) {
  const blueprintColumns = createBlueprintColumns();

  return (
    <div className="bg-white flex flex-col">
      <TableView
        data={blueprints}
        columns={blueprintColumns}
        getRowId={(blueprint) => blueprint.internalNumber}
      />
    </div>
  );
}