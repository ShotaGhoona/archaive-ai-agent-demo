'use client';

import React, { useState } from 'react';
import { TableView } from '@/shared';
import { FilePreviewModal, PreviewableFile } from '@/widgets';
import { DrawingPageBaseDataInterface } from '@/dummy-data-er-fix/blueprint';
import { createBlueprintTableConfig } from '../lib';

interface BlueprintTableViewProps {
  blueprints: DrawingPageBaseDataInterface[];
  onBlueprintUpdate?: (
    rowId: string,
    field: string,
    value: unknown,
  ) => void;
}

export function BlueprintTableView({
  blueprints,
  onBlueprintUpdate,
}: BlueprintTableViewProps) {
  const [previewFile, setPreviewFile] =
    useState<DrawingPageBaseDataInterface | null>(null);

  const convertBlueprintToPreviewable = (
    blueprint: DrawingPageBaseDataInterface,
  ): PreviewableFile => ({
    id: blueprint.id.toString(),
    name: blueprint.drawing_file_name || blueprint.leaf_product_name,
    url: blueprint.s3_url || '/placeholder-image.png',
    type: 'image/png',
    size: 0,
    metadata: {
      customerName: blueprint.customer_name,
      productName: blueprint.leaf_product_name,
      drawingNumber: blueprint.drawing_number,
    },
  });

  const config = createBlueprintTableConfig();

  return (
    <>
      <TableView
        data={blueprints}
        config={config}
        onItemUpdate={onBlueprintUpdate}
        getRowId={(blueprint) => blueprint.id.toString()}
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
