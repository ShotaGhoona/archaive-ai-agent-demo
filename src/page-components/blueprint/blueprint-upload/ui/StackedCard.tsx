import { useState } from "react";
import { Card, CardContent, Button } from "@/shared/shadcnui";
import { 
  FileImage, 
  ZoomIn, 
  Ungroup, 
  Trash2,
  Check,
  Plus,
  Layers
} from "lucide-react";
import { FilePreviewModal, PreviewableFile } from "@/features/file-preview";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  createdAt: Date;
}

interface StackedCardProps {
  stackedFiles: UploadedFile[];
  isSelected: boolean;
  onToggleSelection: () => void;
  onUnstackFiles: () => void;
  onRemoveStack: () => void;
}

export function StackedCard({
  stackedFiles,
  isSelected,
  onToggleSelection,
  onUnstackFiles,
  onRemoveStack
}: StackedCardProps) {
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  
  // 代表として最初のファイルを使用
  const representativeFile = stackedFiles[0];
  const stackCount = stackedFiles.length;

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getTotalSize = () => {
    return stackedFiles.reduce((total, file) => total + file.size, 0);
  };

  const handleViewClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsViewModalOpen(true);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!(e.target as HTMLElement).closest('button')) {
      onToggleSelection();
    }
  };

  // UploadedFile を PreviewableFile に変換
  const convertToPreviewableFiles = (files: UploadedFile[]): PreviewableFile[] => 
    files.map(file => ({
      id: file.id,
      name: file.name,
      url: file.url,
      type: file.type,
      size: file.size,
      metadata: {
        createdAt: file.createdAt
      }
    }));

  return (
    <>
      <div className="group cursor-pointer" onClick={handleCardClick}>
        <div className="relative">
          {/* 重なりを表現する背景カード（複数の影） */}
          <div className="absolute inset-0 translate-x-1 translate-y-1 bg-gray-200 rounded-lg opacity-60"></div>
          <div className="absolute inset-0 translate-x-2 translate-y-2 bg-gray-300 rounded-lg opacity-40"></div>
          
          {/* メインカード */}
          <div className={`
            relative bg-white rounded-lg border overflow-hidden hover:shadow-md transition-all duration-200
            ${isSelected ? 'border-primary shadow-lg ring-2 ring-primary/20' : 'border-gray-200'}
          `}>
            <div className="aspect-[4/3] bg-gray-50 relative">
              {representativeFile.type.startsWith('image/') ? (
                <img
                  src={representativeFile.url}
                  alt={representativeFile.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <div className="text-center space-y-2">
                    <FileImage className="h-12 w-12 text-gray-400 mx-auto" />
                    <div className="text-sm text-gray-600 font-medium">
                      {representativeFile.name.split('.').pop()?.toUpperCase()}
                    </div>
                  </div>
                </div>
              )}
              
              {/* ホバー時のオーバーレイとボタン */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-2">
                <Button
                  variant="outline"
                  onClick={handleViewClick}
                  className="bg-white/95 backdrop-blur-sm hover:bg-white"
                >
                  <ZoomIn className="h-4 w-4 mr-1" />
                  表示
                </Button>
                <Button
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    onUnstackFiles();
                  }}
                  className="bg-white/95 backdrop-blur-sm hover:bg-white"
                >
                  <Ungroup className="h-4 w-4 mr-1" />
                  分離
                </Button>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveStack();
                  }}
                  className="bg-white/95 backdrop-blur-sm text-gray-900 hover:bg-white"
                  variant="outline"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  削除
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
                  onToggleSelection();
                }}
              >
                {isSelected ? <Check className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
              </Button>
            </div>

            {/* スタック枚数表示（右上） */}
            <div className="absolute top-2 right-2 z-10">
              <div className="bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1 backdrop-blur-sm">
                <Layers className="h-3 w-3" />
                {stackCount}
              </div>
            </div>

            {/* ファイル名 */}
            <div className="p-3">
              <h4 className="text-sm font-medium text-gray-900 truncate">
                {representativeFile.name} 他{stackCount - 1}件
              </h4>
            </div>
          </div>
        </div>
      </div>

      {/* スタックファイル表示モーダル */}
      <FilePreviewModal
        files={convertToPreviewableFiles(stackedFiles)}
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        initialFileIndex={0}
      />
    </>
  );
}