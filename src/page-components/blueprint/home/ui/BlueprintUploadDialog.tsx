import { useState, useRef } from "react";
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
} from "@/shared/shadcnui";
import { Plus, Loader2, Upload } from "lucide-react";
import { useRouter } from "next/navigation";

interface BlueprintUploadDialogProps {
  onUploadComplete?: () => void;
}

export function BlueprintUploadDialog({ onUploadComplete }: BlueprintUploadDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [uploadedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFileSelect = async (files: FileList) => {
    const validFiles = Array.from(files).filter(file => 
      file.type.startsWith('image/') || 
      file.name.endsWith('.dwg') || 
      file.name.endsWith('.step') || 
      file.name.endsWith('.igs') ||
      file.name.endsWith('.pdf')
    );
    
    if (validFiles.length > 0) {
      // ファイルアップロード後、即座に/blueprint/uploadに遷移
      setIsUploading(true);
      try {
        // 模擬的なアップロード処理
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // SessionStorageにファイル情報を保存（実際の実装では適切なデータ管理を行う）
        const fileData = validFiles.map(file => ({
          name: file.name,
          size: file.size,
          type: file.type,
          // 実際の実装ではアップロードされたファイルのURLを保存
          url: URL.createObjectURL(file)
        }));
        
        sessionStorage.setItem('uploadedFiles', JSON.stringify(fileData));
        
        router.push('/blueprint/upload');
        setIsOpen(false);
        onUploadComplete?.();
      } catch (error) {
        console.error('アップロードエラー:', error);
        setIsUploading(false);
      }
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileSelect(files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  // Unused functions - commenting out for future use
  /*
  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeAllFiles = () => {
    setUploadedFiles([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUpload = async () => {
    if (uploadedFiles.length === 0) return;
    
    setIsUploading(true);
    try {
      // 模擬的なアップロード処理（複数ファイル対応）
      const uploadPromises = uploadedFiles.map((file, index) => 
        new Promise(resolve => setTimeout(resolve, 1000 + (index * 500)))
      );
      await Promise.all(uploadPromises);
      
      // アップロード完了後、/blueprint/uploadページに遷移
      router.push('/blueprint/upload');
      setIsOpen(false);
      setUploadedFiles([]);
      onUploadComplete?.();
    } catch (error) {
      console.error('アップロードエラー:', error);
    } finally {
      setIsUploading(false);
    }
  };
  */

  const handleNavigateToUpload = () => {
    router.push('/blueprint/upload');
    setIsOpen(false);
  };

  /*
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  */

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button size="lg" className="bg-primary hover:bg-primary/90">
          <Plus className="h-5 w-5 mr-2" />
          新規図面登録
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end">
        <Card className="border-0 shadow-none">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium">新規図面登録</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* ファイルアップロード領域 */}
            <div
              className={`
                border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
                ${dragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-gray-400'}
                ${uploadedFiles.length > 0 ? 'border-green-300 bg-green-50' : ''}
              `}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
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
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-blue-800">
                      アップロード中...
                    </p>
                    <p className="text-xs text-gray-500">
                      しばらくお待ちください
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-700">
                      図面ファイルをアップロード
                    </p>
                    <p className="text-xs text-gray-500">
                      複数ファイル対応 - 選択後自動で登録画面へ
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1 justify-center mt-2">
                    <Badge variant="outline" className="text-xs">DWG</Badge>
                    <Badge variant="outline" className="text-xs">STEP</Badge>
                    <Badge variant="outline" className="text-xs">IGS</Badge>
                    <Badge variant="outline" className="text-xs">PNG</Badge>
                    <Badge variant="outline" className="text-xs">JPG</Badge>
                    <Badge variant="outline" className="text-xs">PDF</Badge>
                  </div>
                </div>
              )}
            </div>
            
            {/* アクションボタン */}
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="flex-1"
                disabled={isUploading}
              >
                キャンセル
              </Button>
              
              <Button
                size="sm"
                onClick={handleNavigateToUpload}
                className="flex-1"
                disabled={isUploading}
              >
                <Plus className="h-3 w-3 mr-2" />
                登録画面へ
              </Button>
            </div>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
}