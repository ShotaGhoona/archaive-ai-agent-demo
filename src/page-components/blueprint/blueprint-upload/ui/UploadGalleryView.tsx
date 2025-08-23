import { useState } from "react";
import { Button } from "@/shared";
import { 
  FileImage, 
  ZoomIn, 
  RotateCcw, 
  Trash2
} from "lucide-react";
import { FilePreviewModal, PreviewableFile } from "@/features";
import { AddFileCard } from "./component/AddFileCard";
import { StackedCard } from "./component/StackedCard";
import { UploadGalleryViewProps, UploadedFile, DragItem } from "../model";

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
  onAddFiles,
  onDragStart
}: UploadGalleryViewProps) {
  const [viewModalFile, setViewModalFile] = useState<UploadedFile | null>(null);


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

  const handleFileDragStart = (file: UploadedFile, e: React.DragEvent) => {
    const dragItem: DragItem = {
      type: 'file',
      id: file.id,
      files: [file]
    };
    onDragStart?.(dragItem);
    
    // ドラッグ効果を設定
    e.dataTransfer.effectAllowed = 'move';
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


  return (
    <>
      <div className="overflow-auto flex-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-1">
          {/* アップロードビューの場合、最初に追加カードを表示 */}
          {viewMode === "uploaded" && <AddFileCard onAddFiles={onAddFiles} />}
          
          {/* 重ねられたファイルスタック（uploadedモードのみ） */}
          {viewMode === "uploaded" && fileStacks.map((stack) => (
            <StackedCard
              key={stack.id}
              stackId={stack.id}
              stackedFiles={stack.files}
              isSelected={selectedStacks.includes(stack.id)}
              onToggleSelection={() => onToggleStackSelection(stack.id)}
              onUnstackFiles={() => onUnstackFiles(stack.id)}
              onRemoveStack={() => onRemoveStack(stack.id)}
              onDragStart={onDragStart}
            />
          ))}
          
          {/* 通常のファイル */}
          {files.map((file) => {
            const isSelected = selectedFiles.includes(file.id);
            
            return (
              <div
                key={file.id}
                className="group cursor-pointer"
                draggable={viewMode === "uploaded"}
                onClick={(e) => handleCardClick(file, e)}
                onDragStart={(e) => handleFileDragStart(file, e)}
              >
                <div className={`
                  relative bg-white rounded-lg border overflow-hidden hover:shadow-md transition-all duration-200
                  ${isSelected ? 'border-primary border-2 shadow-xl ring-4 ring-primary/30' : 'border-gray-200'}
                `}>
                  <div className="aspect-[4/3] bg-gray-50 relative">
                    {file.type.startsWith('image/') ? (
                      <img
                        src={file.url}
                        alt={file.name}
                        className="w-full h-full object-cover"
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
                    
                  </div>


                  {/* ファイル名とボタン群 */}
                  <div className="p-3 space-y-2">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {file.name}
                    </h4>
                    
                    {/* ボタン群 */}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => handleViewClick(file, e)}
                        className="flex-1 text-xs"
                      >
                        <ZoomIn className="h-3 w-3 mr-1" />
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
                        variant="outline"
                        size="sm"
                      >
                        {viewMode === "uploaded" ? (
                          <>
                            <Trash2 className="h-3 w-3" />
                          </>
                        ) : (
                          <>
                            <RotateCcw className="h-3 w-3 mr-1" />
                            復元
                          </>
                        )}
                      </Button>
                    </div>
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