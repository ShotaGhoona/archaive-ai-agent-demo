import { useState } from "react";
import { Card, CardContent, Button } from "@/shared/shadcnui";
import { 
  FileImage, 
  ZoomIn, 
  RotateCcw, 
  Trash2,
  Check,
  Plus
} from "lucide-react";
import { BlueprintViewModal } from "./BlueprintViewModal";
import { AddFileCard } from "./AddFileCard";
import { StackedCard } from "./StackedCard";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  createdAt: Date;
}

interface FileStack {
  id: string;
  files: UploadedFile[];
  createdAt: Date;
}

interface UploadGalleryViewProps {
  files: UploadedFile[];
  fileStacks: FileStack[];
  selectedFiles: string[];
  selectedStacks: string[];
  viewMode: "uploaded" | "trash";
  onRemoveFile: (id: string) => void;
  onRestoreFile: (id: string) => void;
  onToggleSelection: (id: string) => void;
  onToggleStackSelection: (stackId: string) => void;
  onUnstackFiles: (stackId: string) => void;
  onRemoveStack: (stackId: string) => void;
  onAddFiles: (files: Omit<UploadedFile, 'id' | 'createdAt'>[]) => void;
}

export function UploadGalleryView({
  files,
  fileStacks,
  selectedFiles,
  selectedStacks,
  viewMode,
  onRemoveFile,
  onRestoreFile,
  onToggleSelection,
  onToggleStackSelection,
  onUnstackFiles,
  onRemoveStack,
  onAddFiles
}: UploadGalleryViewProps) {
  const [viewModalFile, setViewModalFile] = useState<UploadedFile | null>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleCardClick = (file: UploadedFile, e: React.MouseEvent) => {
    e.preventDefault();
    if (!(e.target as HTMLElement).closest('button')) {
      onToggleSelection(file.id);
    }
  };

  const handleViewClick = (file: UploadedFile, e: React.MouseEvent) => {
    e.stopPropagation();
    setViewModalFile(file);
  };


  // uploadedモードではfileStacksも考慮する
  const hasContent = viewMode === "uploaded" ? files.length > 0 || fileStacks.length > 0 : files.length > 0;

  if (!hasContent) {
    return (
      <div className="overflow-auto flex-1">
        {viewMode === "uploaded" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 p-1">
            <AddFileCard onAddFiles={onAddFiles} />
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-4">
              <FileImage className="h-16 w-16 text-gray-300 mx-auto" />
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-gray-500">
                  ゴミ箱は空です
                </h3>
                <p className="text-sm text-gray-400">
                  削除された図面はここに表示されます
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="overflow-auto flex-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 p-1">
          {/* アップロードビューの場合、最初に追加カードを表示 */}
          {viewMode === "uploaded" && <AddFileCard onAddFiles={onAddFiles} />}
          
          {/* 重ねられたファイルスタック（uploadedモードのみ） */}
          {viewMode === "uploaded" && fileStacks.map((stack) => (
            <StackedCard
              key={stack.id}
              stackedFiles={stack.files}
              isSelected={selectedStacks.includes(stack.id)}
              onToggleSelection={() => onToggleStackSelection(stack.id)}
              onUnstackFiles={() => onUnstackFiles(stack.id)}
              onRemoveStack={() => onRemoveStack(stack.id)}
            />
          ))}
          
          {/* 通常のファイル */}
          {files.map((file) => {
            const isSelected = selectedFiles.includes(file.id);
            
            return (
              <Card 
                key={file.id} 
                className={`
                  overflow-hidden transition-all duration-200 group relative cursor-pointer
                  ${isSelected ? 'ring-2 ring-primary shadow-lg' : 'hover:shadow-lg'}
                `}
                onClick={(e) => handleCardClick(file, e)}
              >
                {/* 選択チェックボックス */}
                <div className="absolute top-2 left-2 z-10">
                  <Button
                    variant={isSelected ? "default" : "secondary"}
                    size="sm"
                    className={`
                      h-6 w-6 p-0 rounded-full transition-opacity
                      ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
                    `}
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleSelection(file.id);
                    }}
                  >
                    {isSelected ? <Check className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
                  </Button>
                </div>

                
                <div className="aspect-video overflow-hidden bg-gray-100">
                  {file.type.startsWith('image/') ? (
                    <img
                      src={file.url}
                      alt={file.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-50">
                      <div className="text-center space-y-2">
                        <FileImage className="h-8 w-8 text-gray-400 mx-auto" />
                        <div className="text-xs text-gray-500 font-medium">
                          {file.name.split('.').pop()?.toUpperCase()}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <CardContent className="p-4 relative">
                  <div className="space-y-2">
                    <h3 className="font-medium text-gray-900 truncate text-sm">
                      {file.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 font-mono">
                        {formatFileSize(file.size)}
                      </span>
                      <span className="text-xs text-gray-500">
                        {file.type.startsWith('image/') ? 'IMAGE' : file.name.split('.').pop()?.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  
                  {/* アクションボタン（ホバー時のみ表示、absolute配置） */}
                  <div className="absolute inset-x-4 bottom-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => handleViewClick(file, e)}
                      className="flex-1 bg-white/95 backdrop-blur-sm"
                    >
                      <ZoomIn className="h-4 w-4 mr-1" />
                      拡大
                    </Button>
                    
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        viewMode === "uploaded" ? onRemoveFile(file.id) : onRestoreFile(file.id);
                      }}
                      className="flex-1 backdrop-blur-sm"
                    >
                      {viewMode === "uploaded" ? (
                        <>
                          <Trash2 className="h-4 w-4 mr-1" />
                          削除
                        </>
                      ) : (
                        <>
                          <RotateCcw className="h-4 w-4 mr-1" />
                          復元
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* 拡大表示モーダル */}
      {viewModalFile && (
        <BlueprintViewModal
          files={[viewModalFile]}
          isOpen={!!viewModalFile}
          onClose={() => setViewModalFile(null)}
        />
      )}
    </>
  );
}