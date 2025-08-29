'use client';
import { useState, useRef } from "react";
import { 
  Button, 
  Card, 
  CardContent,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  LoadingSpinner
} from "@/shared";
import { Plus, X, FileText, Expand } from "lucide-react";
import { BlueprintViewContainerData } from "../model";

interface BlueprintDetailSidebarProps {
  views: BlueprintViewContainerData[];
  onViewAdd: (view: BlueprintViewContainerData) => void;
  onViewSelect: (viewId: string) => void;
  onViewRemove: (viewId: string) => void;
}

export function BlueprintDetailSidebar({ 
  views,
  onViewAdd, 
  onViewSelect, 
  onViewRemove 
}: BlueprintDetailSidebarProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [isGalleryMode, setIsGalleryMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (fileList: FileList) => {
    const validFiles = Array.from(fileList).filter(file => 
      file.type.startsWith('image/') || 
      file.name.endsWith('.dwg') || 
      file.name.endsWith('.step') || 
      file.name.endsWith('.igs') ||
      file.name.endsWith('.pdf')
    );
    
    if (validFiles.length > 0) {
      setIsUploading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const newViews = validFiles.map(file => ({
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          name: file.name.split('.')[0], // ファイル拡張子を除いた名前
          fileName: file.name,
          description: `新しくアップロードされた図面ビュー`,
          viewType: 'custom',
          imageUrl: URL.createObjectURL(file),
          fileType: file.name.split('.').pop() || 'unknown',
          uploadDate: new Date().toISOString(),
          isActive: false,
          createdAt: new Date().toISOString()
        }));
        
        newViews.forEach(view => onViewAdd(view));
      } catch (error) {
        console.error('アップロードエラー:', error);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (fileList && fileList.length > 0) {
      handleFileSelect(fileList);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const fileList = e.dataTransfer.files;
    if (fileList && fileList.length > 0) {
      handleFileSelect(fileList);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleViewClick = (viewId: string) => {
    onViewSelect(viewId);
    if (isGalleryMode) {
      setIsGalleryMode(false);
    }
  };

  const handleRemoveView = (viewId: string) => {
    onViewRemove(viewId);
  };

  return (
    <div className={`h-full flex flex-col z-10 absolute left-0 top-0 transition-all duration-300 ${
      isGalleryMode ? 'w-full bg-white/10 backdrop-blur-md' : 'w-48 bg-gradient-to-r from-white/80 via-white/60 to-transparent'
    }`}>
      {/* 図面ビュー一覧 */}
      <div className="flex-1 overflow-y-auto scrollbar-hidden p-4">
        <div className={`${ isGalleryMode ? 'grid grid-cols-4 gap-4' : 'space-y-3'}`}>
        
        <div 
          className={`
            border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors
            ${dragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-gray-400'}
            ${isUploading ? 'border-blue-300 bg-blue-50' : ''}
          `}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => !isUploading && fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".dwg,.step,.igs,.png,.jpg,.jpeg,.pdf"
            onChange={handleFileInputChange}
            className="hidden"
          />
          
          {isUploading ? (
            <div className="space-y-2">
              <LoadingSpinner size="sm" className="text-blue-600 mx-auto" />
              <div className="text-xs text-blue-600 font-medium">
                アップロード中...
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 w-full h-full">
                <Plus className="h-6 w-6 text-gray-400" />
                <div className="text-gray-600 text-sm mr-2">
                  図面を追加
                </div>
            </div>
          )}
        </div>

        {/* 図面ビューリスト */}
        {views.map((view) => (
          <div key={view.id} className="w-full">
            <Card 
              className={`
                cursor-pointer transition-all duration-200 group relative py-1
                ${view.isActive 
                  ? 'ring-2 ring-primary' 
                  : 'hover:shadow-md hover:bg-gray-50'
                }
              `}
              onClick={() => handleViewClick(view.id)}
            >
            {/* 展開ボタン (サイドバーモード時のみ) */}
            {!isGalleryMode && (
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsGalleryMode(true);
                }}
                className="absolute top-2 left-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Expand className="h-3 w-3" />
              </Button>
            )}
            
            {/* 削除ボタン */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-3 w-3" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>図面ビューを削除しますか？</AlertDialogTitle>
                  <AlertDialogDescription>
                    「{view.name}」を削除します。この操作は取り消せません。
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>キャンセル</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleRemoveView(view.id)}
                    className="text-white bg-red-500 hover:bg-red-600"
                  >
                    削除
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <CardContent className="p-2">
              <div className="space-y-2">
                <div className="aspect-video w-full bg-gray-100 rounded overflow-hidden">
                  {view.imageUrl ? (
                    <img 
                      src={view.imageUrl} 
                      alt={view.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FileText className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="px-1">
                  <h4 className="text-xs font-medium text-gray-900 truncate">
                    {view.name}
                  </h4>
                </div>
              </div>
            </CardContent>
          </Card>
          </div>
        ))}
        
        {views.length === 0 && (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">図面ビューがありません</p>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}