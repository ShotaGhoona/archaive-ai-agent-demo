import { useState } from "react";
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/shadcnui";
import { 
  FolderPlus, 
  BookOpen, 
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
  onAddFiles,
  onStackFiles,
  uploadedFilesCount,
  trashedFilesCount,
  stacksCount
}: UploadPageHeaderProps) {
  const [isProjectOpen, setIsProjectOpen] = useState(false);

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
            size="sm"
            onClick={() => onViewModeChange("uploaded")}
            className="h-8 px-3"
          >
            <Upload className="h-4 w-4 mr-1" />
            アップロード ({uploadedFilesCount})
          </Button>
          <Button
            variant={viewMode === "trash" ? "default" : "ghost"}
            size="sm"
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
            size="sm"
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
              size="sm"
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
              size="sm"
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
              size="sm"
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
      
      <div className="flex items-center gap-4">
        {/* 案件登録ボタン */}
        <Popover open={isProjectOpen} onOpenChange={setIsProjectOpen}>
          <PopoverTrigger asChild>
            <Button size="sm" className="bg-primary hover:bg-primary/90">
              <FolderPlus className="h-4 w-4 mr-2" />
              案件登録
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="end">
            <Card className="border-0 shadow-none">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium">案件登録</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center space-y-3">
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto" />
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">
                      案件登録機能
                    </p>
                    <p className="text-xs text-gray-500">
                      アップロードされた図面を案件として登録します
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsProjectOpen(false)}
                    className="flex-1"
                  >
                    キャンセル
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      console.log("案件登録処理");
                      setIsProjectOpen(false);
                    }}
                    className="flex-1"
                  >
                    登録開始
                  </Button>
                </div>
              </CardContent>
            </Card>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}