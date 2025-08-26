"use client";
import { TableView } from "@/shared";
import { Blueprint, createBlueprintTableConfig } from "@/page-components/blueprint/home/lib/blueprintTableConfig";

interface BlueprintTableProps {
  blueprints: Blueprint[];
}

export function BlueprintTable({ blueprints }: BlueprintTableProps) {
  const config = createBlueprintTableConfig();

  return (
    <div className="bg-white flex flex-col">
      <TableView
        data={blueprints}
        config={config}
        getRowId={(blueprint) => blueprint.internalNumber}
      />
    </div>
  );
}