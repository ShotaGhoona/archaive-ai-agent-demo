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
} from "@/components/ui";
import { Search, Upload, X, FileImage, Loader2 } from "lucide-react";

interface SimilarBlueprintSearchDialogProps {
  onSearchResults?: (results: any[]) => void;
}

export function SimilarBlueprintSearchDialog({ onSearchResults }: SimilarBlueprintSearchDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (file && (file.type.startsWith('image/') || file.name.endsWith('.dwg') || file.name.endsWith('.step') || file.name.endsWith('.igs'))) {
      setUploadedFile(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const removeFile = () => {
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSearch = async () => {
    if (!uploadedFile) return;
    
    setIsSearching(true);
    // ここで実際の類似検索APIを呼び出す
    try {
      // 模擬的な検索処理
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 模擬的な検索結果
      const mockResults = [
        { id: 1, filename: "BP001_エンジンブラケット.dwg", similarity: 95 },
        { id: 2, filename: "BP015_熱交換器プレート.dwg", similarity: 87 },
        { id: 3, filename: "BP022_ブレーキディスク.igs", similarity: 82 }
      ];
      
      onSearchResults?.(mockResults);
      setIsOpen(false);
      setUploadedFile(null);
    } catch (error) {
      console.error('検索エラー:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button size="sm">
          <Search className="h-4 w-4 mr-2" />
          類似図面検索
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end">
        <Card className="border-0 shadow-none">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium">類似図面検索</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* ファイルアップロード領域 */}
            <div
              className={`
                border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
                ${dragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-gray-400'}
                ${uploadedFile ? 'border-green-300 bg-green-50' : ''}
              `}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".dwg,.step,.igs,.png,.jpg,.jpeg,.pdf"
                onChange={handleFileInputChange}
                className="hidden"
              />
              
              {uploadedFile ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-center">
                    <FileImage className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-green-800">
                      {uploadedFile.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(uploadedFile.size)}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile();
                    }}
                    className="mt-2"
                  >
                    <X className="h-3 w-3 mr-1" />
                    削除
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-700">
                      図面ファイルをアップロード
                    </p>
                    <p className="text-xs text-gray-500">
                      ドラッグ&ドロップまたはクリックしてファイルを選択
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
            {/* 検索ボタン */}
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="flex-1"
                disabled={isSearching}
              >
                キャンセル
              </Button>
              <Button
                size="sm"
                onClick={handleSearch}
                disabled={!uploadedFile || isSearching}
                className="flex-1"
              >
                {isSearching ? (
                  <>
                    <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                    検索中...
                  </>
                ) : (
                  <>
                    <Search className="h-3 w-3 mr-2" />
                    検索実行
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
}