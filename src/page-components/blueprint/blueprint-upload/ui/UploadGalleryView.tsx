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
import { FilePreviewModal, PreviewableFile } from "@/features/file-preview";
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

  // UploadedFile を PreviewableFile に変換
  const convertToPreviewableFile = (file: UploadedFile): PreviewableFile => ({
    id: file.id,
    name: file.name,
    url: file.url,
    type: file.type,
    size: file.size,
    metadata: {
      createdAt: file.createdAt
    }
  });


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
              <div
                key={file.id}
                className="group cursor-pointer"
                onClick={(e) => handleCardClick(file, e)}
              >
                <div className={`
                  relative bg-white rounded-lg border overflow-hidden hover:shadow-md transition-all duration-200
                  ${isSelected ? 'border-primary shadow-lg ring-2 ring-primary/20' : 'border-gray-200'}
                `}>
                  <div className="aspect-[4/3] bg-gray-50 relative">
                    {file.type.startsWith('image/') ? (
                      <img
                        src={file.url}
                        alt={file.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <div className="text-center space-y-2">
                          <FileImage className="h-12 w-12 text-gray-400 mx-auto" />
                          <div className="text-sm text-gray-600 font-medium">
                            {file.name.split('.').pop()?.toUpperCase()}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* ホバー時のオーバーレイとボタン */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-2">
                      <Button
                        variant="outline"
                        onClick={(e) => handleViewClick(file, e)}
                        className="bg-white/95 backdrop-blur-sm hover:bg-white"
                      >
                        <ZoomIn className="h-4 w-4 mr-1" />
                        拡大
                      </Button>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (viewMode === "uploaded") {
                            onRemoveFile?.(file.id);
                          } else {
                            onRestoreFile?.(file.id);
                          }
                        }}
                        className="bg-white/95 backdrop-blur-sm text-gray-900 hover:bg-white"
                        variant="outline"
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
                  </div>

                  {/* 選択チェックボックス（左上） */}
                  <div className="absolute top-2 left-2 z-10">
                    <Button
                      variant={isSelected ? "default" : "secondary"}
                      size="sm"
                      className={`
                        h-6 w-6 p-0 rounded-full transition-opacity backdrop-blur-sm
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

                  {/* ファイル名 */}
                  <div className="p-3">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {file.name}
                    </h4>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 拡大表示モーダル */}
      {viewModalFile && (
        <FilePreviewModal
          files={[convertToPreviewableFile(viewModalFile)]}
          isOpen={!!viewModalFile}
          onClose={() => setViewModalFile(null)}
        />
      )}
    </>
  );
}