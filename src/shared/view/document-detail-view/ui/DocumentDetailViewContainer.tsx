"use client";

import { useState, useEffect } from "react";
import { ResizableLayout, ResizablePanel, ResizableHandle, LoadingScreen } from "@/shared";
import { DocumentData, DocumentDetailViewContainerProps } from "../model";
import { documentDetailResizableLayoutConfig } from "../lib";
import { DocumentList } from "./DocumentList";
import { DocumentPreview } from "./DocumentPreview";
import { DocumentInfoPanel } from "./DocumentInfoPanel";

export function DocumentDetailViewContainer<T extends DocumentData>({
  data,
  config,
}: DocumentDetailViewContainerProps<T>) {
  const [selectedItem, setSelectedItem] = useState<T | null>(null);

  useEffect(() => {
    if (data.length > 0 && !selectedItem) {
      setSelectedItem(data[0]);
    }
  }, [data, selectedItem]);

  const handleSelectItem = (item: T) => {
    setSelectedItem(item);
  };

  const handleUpdateItem = (updateData: Partial<T>) => {
    if (!selectedItem) return;
    
    const updatedItem = { ...selectedItem, ...updateData };
    setSelectedItem(updatedItem);
    
    console.log("帳票データを更新:", updatedItem);
  };

  if (data.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center text-gray-500">
          <div className="text-4xl mb-4">📄</div>
          <p>帳票がありません</p>
        </div>
      </div>
    );
  }

  if (!selectedItem) {
    return <LoadingScreen message="帳票を読み込み中..." className="h-full" />;
  }

  return (
    <div className="h-full flex">
      <div className="w-60 flex-shrink-0">
        <DocumentList
          items={data}
          selectedId={config.dataConfig.getItemId(selectedItem)}
          config={config}
          onSelect={handleSelectItem}
          documentType={config.documentType}
        />
      </div>

      <div className="flex-1">
        <ResizableLayout config={documentDetailResizableLayoutConfig}>
          <ResizablePanel index={0}>
            <div className="h-full overflow-hidden">
              <DocumentPreview
                item={selectedItem}
                config={config}
                onUpdate={handleUpdateItem}
              />
            </div>
          </ResizablePanel>
          
          <ResizableHandle />
          
          <ResizablePanel index={1}>
            <div className="h-full overflow-hidden">
              <DocumentInfoPanel
                item={selectedItem}
                config={config}
                onUpdate={handleUpdateItem}
              />
            </div>
          </ResizablePanel>
        </ResizableLayout>
      </div>
    </div>
  );
}