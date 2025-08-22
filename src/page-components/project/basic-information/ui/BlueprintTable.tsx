"use client";
import { TableView } from "@/shared/view/table-view";
import { createBlueprintColumns, Blueprint } from "@/page-components/blueprint/home/lib/blueprintColumns";

interface BlueprintTableProps {
  blueprints: Blueprint[];
}

export default function BlueprintTable({ blueprints }: BlueprintTableProps) {
  const blueprintColumns = createBlueprintColumns();

  return (
    <div className="bg-white flex flex-col">
      <TableView
        data={blueprints}
        columns={blueprintColumns}
        getRowId={(blueprint) => blueprint.internalNumber}
        emptyMessage="登録されている図面はありません"
      />
    </div>
  );
}