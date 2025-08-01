import React, { useState } from "react";
import { BasicDataTable } from "@/shared/basic-data-table";
import { Blueprint, createBlueprintColumns } from "../lib/blueprintColumns";
import { FilePreviewModal, PreviewableFile } from "@/features/file-preview";

interface TableViewProps {
  blueprints: Blueprint[];
  onBlueprintUpdate?: (internalNumber: string, field: string, value: unknown) => void;
}

export function TableView({ blueprints, onBlueprintUpdate }: TableViewProps) {
  const [previewFile, setPreviewFile] = useState<Blueprint | null>(null);

  // Blueprint を PreviewableFile に変換
  const convertBlueprintToPreviewable = (blueprint: Blueprint): PreviewableFile => ({
    id: blueprint.internalNumber,
    name: blueprint.filename,
    url: blueprint.image || '/placeholder-image.png', // 画像URLまたはプレースホルダー
    type: 'image/png', // 適切なMIMEタイプを設定
    size: 0, // サイズ情報がない場合は0
    metadata: {
      orderSource: blueprint.orderSource,
      productName: blueprint.productName,
      customerNumber: blueprint.customerNumber,
    }
  });

  const handlePreview = (blueprint: Blueprint) => {
    setPreviewFile(blueprint);
  };

  const columns = createBlueprintColumns({
    onPreview: handlePreview
  });

  return (
    <>
      <BasicDataTable
        data={blueprints}
        columns={columns}
        onItemUpdate={onBlueprintUpdate}
        getRowId={(blueprint) => blueprint.internalNumber}
        emptyMessage="図面データがありません"
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