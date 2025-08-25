"use client";

import React, { useState } from "react";
import { TableView } from "@/shared";
import { FilePreviewModal, PreviewableFile } from "@/features";
import { Blueprint, createBlueprintColumns } from "../lib";

interface BlueprintTableViewProps {
  blueprints: Blueprint[];
  onBlueprintUpdate?: (internalNumber: string, field: string, value: unknown) => void;
  currentPage?: number;
  totalItems?: number;
  itemsPerPage?: number;
  onPageChange?: (page: number) => void;
}

export function BlueprintTableView({ 
  blueprints, 
  onBlueprintUpdate,
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange
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

  const columns = createBlueprintColumns();

  // ページネーション設定
  const paginationConfig = currentPage && totalItems && itemsPerPage && onPageChange ? {
    enabled: true,
    currentPage,
    itemsPerPage,
    totalItems,
    onPageChange,
  } : undefined;

  return (
    <>
      <TableView
        data={blueprints}
        columns={columns}
        onItemUpdate={onBlueprintUpdate}
        getRowId={(blueprint) => blueprint.internalNumber}
        pagination={paginationConfig}
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