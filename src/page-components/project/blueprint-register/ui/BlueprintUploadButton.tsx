"use client";
import React, { useState } from "react";
import { Upload, FileText, X } from "lucide-react";
import { 
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Progress
} from "@/shared";

interface BlueprintUploadButtonProps {
  onFileUpload?: (files: FileList) => void;
}

export function BlueprintUploadButton({ onFileUpload }: BlueprintUploadButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      setSelectedFiles(fileArray);
      onFileUpload?.(files);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const fileArray = Array.from(e.dataTransfer.files);
      const validFiles = fileArray.filter(file => {
        const extension = file.name.toLowerCase().split('.').pop();
        return ['pdf', 'dwg', 'dxf', 'jpg', 'jpeg', 'png', 'tif', 'tiff'].includes(extension || '');
      });
      setSelectedFiles(validFiles);
      onFileUpload?.(e.dataTransfer.files);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const startUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);
    
    // TODO: 実際のアップロード処理を実装
    // シミュレーション用
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setSelectedFiles([]);
          setIsOpen(false);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="lg">
          <Upload className="h-4 w-4 mr-2" />
          図面を追加する
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="start">
        <div className="p-4 border-b">
          <h3 className="font-semibold text-gray-900">図面ファイルをアップロード</h3>
          <p className="text-sm text-gray-500 mt-1">
            PDF, DWG, DXF, JPG, PNG, TIF ファイルに対応
          </p>
        </div>
        
        <div className="p-4">
          {/* ドラッグ&ドロップエリア */}
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              dragActive 
                ? 'border-blue-400 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className={`h-8 w-8 mx-auto mb-2 ${
              dragActive ? 'text-blue-500' : 'text-gray-400'
            }`} />
            <p className="text-sm font-medium text-gray-700 mb-1">
              ファイルをドロップするか、
            </p>
            <input
              type="file"
              multiple
              accept=".pdf,.dwg,.dxf,.jpg,.jpeg,.png,.tif,.tiff"
              onChange={handleFileSelect}
              className="hidden"
              id="fileUploadPopover"
            />
            <label htmlFor="fileUploadPopover">
              <Button variant="outline" size="sm" className="cursor-pointer">
                ファイルを選択
              </Button>
            </label>
          </div>

          {/* 選択されたファイル一覧 */}
          {selectedFiles.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">
                選択されたファイル ({selectedFiles.length})
              </h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center flex-1 min-w-0">
                      <FileText className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                      <span className="text-sm text-gray-700 truncate">
                        {file.name}
                      </span>
                      <span className="text-xs text-gray-500 ml-2">
                        ({Math.round(file.size / 1024)}KB)
                      </span>
                    </div>
                    {!isUploading && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 hover:bg-red-100"
                        onClick={() => removeFile(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* アップロード進行状況 */}
          {isUploading && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">アップロード中...</span>
                <span className="text-sm text-gray-500">{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="w-full" />
            </div>
          )}

          {/* アクションボタン */}
          <div className="flex justify-between mt-6">
            <Button 
              variant="ghost" 
              onClick={() => setIsOpen(false)}
              disabled={isUploading}
            >
              キャンセル
            </Button>
            <Button 
              onClick={startUpload}
              disabled={selectedFiles.length === 0 || isUploading}
            >
              {isUploading ? 'アップロード中...' : `${selectedFiles.length}件をアップロード`}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}