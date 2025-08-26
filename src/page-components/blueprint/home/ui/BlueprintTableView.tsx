"use client";

import React, { useState } from "react";
import { ConfigBasedTableView } from "@/shared";
import { FilePreviewModal, PreviewableFile } from "@/widgets";
import { Blueprint, createBlueprintTableConfig } from "../lib";

interface BlueprintTableViewProps {
  blueprints: Blueprint[];
  onBlueprintUpdate?: (internalNumber: string, field: string, value: unknown) => void;
}

export function BlueprintTableView({ 
  blueprints, 
  onBlueprintUpdate
}: BlueprintTableViewProps) {
  const [previewFile, setPreviewFile] = useState<Blueprint | null>(null);

  const convertBlueprintToPreviewable = (blueprint: Blueprint): PreviewableFile => ({
    id: blueprint.internalNumber,
    name: blueprint.filename,
    url: blueprint.image || '/placeholder-image.png', 
    type: 'image/png', 
    size: 0, 
    metadata: {
      orderSource: blueprint.orderSource,
      productName: blueprint.productName,
      customerNumber: blueprint.customerNumber,
    }
  });

  const config = createBlueprintTableConfig();

  return (
    <>
      <ConfigBasedTableView
        data={blueprints}
        config={config}
        onItemUpdate={onBlueprintUpdate}
        getRowId={(blueprint) => blueprint.internalNumber}
      />

      {/* プレビューモーダル */}
      {previewFile && (
        <FilePreviewModal
          files={[convertBlueprintToPreviewable(previewFile)]}
          isOpen={!!previewFile}
          onClose={() => setPreviewFile(null)}
        />
      )}
    </>
  );
}