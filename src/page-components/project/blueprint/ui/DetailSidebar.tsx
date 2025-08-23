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
} from "@/shared";
import { Plus, Loader2, X } from "lucide-react";
import { BlueprintFile } from "@/widgets";

interface DetailSidebarProps {
  files: BlueprintFile[];
  onFileAdd: (file: BlueprintFile) => void;
  onFileSelect: (fileId: string) => void;
  onFileRemove: (fileId: string) => void;
}

export function DetailSidebar({ 
  files,
  onFileAdd, 
  onFileSelect, 
  onFileRemove 
}: DetailSidebarProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
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
        
        const newFiles = validFiles.map(file => ({
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          name: file.name,
          description: `新しくアップロードされたファイル`,
          size: file.size,
          type: file.type,
          imageUrl: URL.createObjectURL(file),
          createdAt: new Date().toISOString(),
          isActive: false
        }));
        
        newFiles.forEach(file => onFileAdd(file));
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

  const handleFileClick = (fileId: string) => {
    onFileSelect(fileId);
  };

  const handleRemoveFile = (fileId: string) => {
    onFileRemove(fileId);
  };


  return (
    <div className="w-64 border-r bg-white flex flex-col">

      {/* ファイル一覧 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {/* 追加ボタン */}
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
              <Loader2 className="h-6 w-6 text-blue-600 animate-spin mx-auto" />
              <div className="text-xs text-blue-600 font-medium">
                アップロード中...
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="flex items-center gap-2">
                <Plus className="h-6 w-6 text-gray-400" />
                <div className="text-gray-600 text-sm mr-2">
                  図面を追加
                </div>
              </div>
              <div className="text-xs text-gray-400">
                クリックorドラッグ&ドロップ
              </div>
            </div>
          )}
        </div>
        {files.map((file) => (
          <Card 
            key={file.id}
            className={`
              cursor-pointer transition-all duration-200 group relative py-1
              ${file.isActive 
                ? 'ring-2 ring-primary bg-primary/5' 
                : 'hover:shadow-md hover:bg-gray-50'
              }
            `}
            onClick={() => handleFileClick(file.id)}
          >
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
                  <AlertDialogTitle>ファイルを削除しますか？</AlertDialogTitle>
                  <AlertDialogDescription>
                    「{file.name}」を削除します。この操作は取り消せません。
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>キャンセル</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleRemoveFile(file.id)}
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
                  <img 
                    src={file.imageUrl} 
                    alt={file.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="px-1">
                  <h4 className="text-xs font-medium text-gray-900 truncate">
                    {file.name}
                  </h4>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}