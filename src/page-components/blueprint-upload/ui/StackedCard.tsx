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
import { StackedFilesViewModal } from "./StackedFilesViewModal";

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

  return (
    <>
      <div className="relative">
        {/* 重なりを表現する背景カード（複数の影） */}
        <div className="absolute inset-0 translate-x-1 translate-y-1 bg-gray-200 rounded-lg opacity-60"></div>
        <div className="absolute inset-0 translate-x-2 translate-y-2 bg-gray-300 rounded-lg opacity-40"></div>
        
        {/* メインカード */}
        <Card 
          className={`
            relative overflow-hidden transition-all duration-200 group cursor-pointer
            ${isSelected ? 'ring-2 ring-primary shadow-lg' : 'hover:shadow-lg'}
            bg-white border-2
          `}
          onClick={handleCardClick}
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
                onToggleSelection();
              }}
            >
              {isSelected ? <Check className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
            </Button>
          </div>

          {/* スタック枚数表示 */}
          <div className="absolute top-2 right-2 z-10">
            <div className="bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">
              <Layers className="h-3 w-3" />
              {stackCount}
            </div>
          </div>

          {/* 画像表示エリア */}
          <div className="aspect-video overflow-hidden bg-gray-100">
            {representativeFile.type.startsWith('image/') ? (
              <img
                src={representativeFile.url}
                alt={representativeFile.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-50">
                <div className="text-center space-y-2">
                  <FileImage className="h-8 w-8 text-gray-400 mx-auto" />
                  <div className="text-xs text-gray-500 font-medium">
                    {representativeFile.name.split('.').pop()?.toUpperCase()}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <CardContent className="p-4 relative">
            <div className="space-y-2">
              <h3 className="font-medium text-gray-900 truncate text-sm">
                {representativeFile.name} 他{stackCount - 1}件
              </h3>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 font-mono">
                  {formatFileSize(getTotalSize())}
                </span>
                <span className="text-xs text-gray-500">
                  {stackCount}枚重ね
                </span>
              </div>
              
              {/* ファイル一覧（最初の3つまで表示） */}
              <div className="space-y-1">
                {stackedFiles.slice(0, 3).map((file, index) => (
                  <div key={file.id} className="text-xs text-gray-400 truncate">
                    {index + 1}. {file.name}
                  </div>
                ))}
                {stackCount > 3 && (
                  <div className="text-xs text-gray-400">
                    ...他{stackCount - 3}件
                  </div>
                )}
              </div>
            </div>
            
            {/* アクションボタン（ホバー時のみ表示） */}
            <div className="absolute inset-x-4 bottom-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <Button
                variant="outline"
                size="sm"
                onClick={handleViewClick}
                className="flex-1 bg-white/95 backdrop-blur-sm"
              >
                <ZoomIn className="h-4 w-4 mr-1" />
                表示
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onUnstackFiles();
                }}
                className="flex-1 bg-white/95 backdrop-blur-sm"
              >
                <Ungroup className="h-4 w-4 mr-1" />
                分離
              </Button>
              
              <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveStack();
                }}
                className="flex-1 backdrop-blur-sm bg-red-600 hover:bg-red-700"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                削除
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* スタックファイル表示モーダル */}
      <StackedFilesViewModal
        stackedFiles={stackedFiles}
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        initialFileIndex={0}
      />
    </>
  );
}