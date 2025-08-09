import { useState } from "react";
import { Button } from "@/shared/shadcnui";
import { 
  CheckSquare, 
  Square, 
  Trash2, 
  RotateCcw, 
  Archive,
  Upload,
  Layers
} from "lucide-react";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  createdAt: Date;
}

interface UploadPageHeaderProps {
  viewMode: "uploaded" | "trash";
  onViewModeChange: (mode: "uploaded" | "trash") => void;
  selectedFiles: string[];
  selectedStacks: string[];
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onRemoveSelected: () => void;
  onRestoreSelected: () => void;
  onAddFiles: (files: Omit<UploadedFile, 'id' | 'createdAt'>[]) => void;
  onStackFiles: () => void;
  uploadedFilesCount: number;
  trashedFilesCount: number;
  stacksCount: number;
}

export function UploadPageHeader({
  viewMode,
  onViewModeChange,
  selectedFiles,
  selectedStacks,
  onSelectAll,
  onDeselectAll,
  onRemoveSelected,
  onRestoreSelected,
  onStackFiles,
  uploadedFilesCount,
  trashedFilesCount,
  stacksCount
}: UploadPageHeaderProps) {
  const hasSelectedFiles = selectedFiles.length > 0;
  const hasSelectedStacks = selectedStacks.length > 0;
  const hasAnySelection = hasSelectedFiles || hasSelectedStacks;
  const totalSelectedItems = selectedFiles.length + selectedStacks.length;
  
  // 図面を重ねる条件：2つ以上のアイテム（ファイルまたはスタック）が選択されている
  const canStackItems = totalSelectedItems >= 2;
  
  const isAllSelected = viewMode === "uploaded" 
    ? selectedFiles.length === uploadedFilesCount && selectedStacks.length === stacksCount && (uploadedFilesCount > 0 || stacksCount > 0)
    : selectedFiles.length === trashedFilesCount && trashedFilesCount > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        {/* ビューモード切り替え */}
        <div className="flex items-center gap-1 border border-gray-200 rounded-lg bg-background">
          <Button
            variant={viewMode === "uploaded" ? "default" : "ghost"}
            size="lg"
            onClick={() => onViewModeChange("uploaded")}
            className="h-8 px-3"
          >
            <Upload className="h-4 w-4 mr-1" />
            アップロード ({uploadedFilesCount})
          </Button>
          <Button
            variant={viewMode === "trash" ? "default" : "ghost"}
            size="lg"
            onClick={() => onViewModeChange("trash")}
            className="h-8 px-3"
          >
            <Archive className="h-4 w-4 mr-1" />
            ゴミ箱 ({trashedFilesCount})
          </Button>
        </div>
        
        {/* 選択操作ボタン */}
        <div className="flex items-center gap-2">
          {/* 全て選択ボタン */}
          <Button
            variant="outline"
            size="lg"
            onClick={onSelectAll}
            disabled={(viewMode === "uploaded" && uploadedFilesCount === 0 && stacksCount === 0) || 
                     (viewMode === "trash" && trashedFilesCount === 0) ||
                     isAllSelected}
          >
            <CheckSquare className="h-4 w-4 mr-1" />
            全て選択
          </Button>
          
          {/* 全て選択解除ボタン（何かが選択されている時のみ表示） */}
          {hasAnySelection && (
            <Button
              variant="outline"
              size="lg"
              onClick={onDeselectAll}
            >
              <Square className="h-4 w-4 mr-1" />
              全て解除
            </Button>
          )}
          
          {/* 図面を重ねるボタン（uploadedモードで複数アイテム選択時のみ表示） */}
          {viewMode === "uploaded" && canStackItems && (
            <Button
              variant="outline"
              size="lg"
              onClick={onStackFiles}
              className="text-blue-600 hover:text-blue-700"
            >
              <Layers className="h-4 w-4 mr-1" />
              図面を重ねる ({totalSelectedItems})
            </Button>
          )}

          {/* 削除/復元ボタン（何かが選択されている時のみ表示） */}
          {hasAnySelection && (
            <Button
              variant="outline"
              size="lg"
              onClick={viewMode === "uploaded" ? onRemoveSelected : onRestoreSelected}
              className={viewMode === "uploaded" ? "text-red-600 hover:text-red-700" : "text-green-600 hover:text-green-700"}
            >
              {viewMode === "uploaded" ? (
                <>
                  <Trash2 className="h-4 w-4 mr-1" />
                  削除 ({totalSelectedItems})
                </>
              ) : (
                <>
                  <RotateCcw className="h-4 w-4 mr-1" />
                  復元 ({selectedFiles.length})
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}