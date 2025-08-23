import { Button, Tabs, TabsList, TabsTrigger } from "@/shared";
import { 
  CheckSquare, 
  Square, 
  Trash2, 
  RotateCcw, 
  Archive,
  Upload,
  Layers
} from "lucide-react";
import { UploadPageHeaderProps } from "../model";

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
        {/* ビューモード切り替え（Tabs使用） */}
        <Tabs value={viewMode} onValueChange={(value) => onViewModeChange(value as "uploaded" | "trash")}>
          <TabsList className="h-10">
            <TabsTrigger value="uploaded" className="flex items-center gap-1 h-8">
              <Upload className="h-4 w-4" />
              アップロード ({uploadedFilesCount})
            </TabsTrigger>
            <TabsTrigger value="trash" className="flex items-center gap-1 h-8">
              <Archive className="h-4 w-4" />
              ゴミ箱 ({trashedFilesCount})
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {/* 右側：図面を重ねる・削除ボタン */}
      <div className="flex items-center gap-2">
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
        </div>
        {/* 図面を重ねるボタン（uploadedモードで複数アイテム選択時のみ表示） */}
        {viewMode === "uploaded" && canStackItems && (
          <Button
            variant="default"
            size="lg"
            onClick={onStackFiles}
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
  );
}