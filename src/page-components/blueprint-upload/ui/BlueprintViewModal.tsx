import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Button,
} from "@/shared/shadcnui";
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  Download, 
  FileImage
} from "lucide-react";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  createdAt: Date;
}

interface BlueprintViewModalProps {
  file: UploadedFile;
  isOpen: boolean;
  onClose: () => void;
}

export function BlueprintViewModal({ file, isOpen, onClose }: BlueprintViewModalProps) {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev * 1.2, 5));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev / 1.2, 0.1));
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const handleReset = () => {
    setZoom(1);
    setRotation(0);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="min-w-[80vw] max-w-[80vw] max-h-[80vh] p-0 overflow-hidden"
      >
        {/* ヘッダー */}
        <DialogHeader className="flex flex-row items-center justify-between p-4 border-b bg-gray-50">
          <div className="flex-1">
            <DialogTitle className="text-lg font-semibold text-gray-900 truncate">
              {file.name}
            </DialogTitle>
            <div className="flex items-center gap-4 mt-1">
              <span className="text-sm text-gray-500">
                {formatFileSize(file.size)}
              </span>
              <span className="text-sm text-gray-500">
                {file.type.startsWith('image/') ? 'IMAGE' : file.name.split('.').pop()?.toUpperCase()}
              </span>
              <span className="text-sm text-gray-500">
                ズーム: {Math.round(zoom * 100)}%
              </span>
            </div>
          </div>
          
          {/* ツールバー */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomOut}
              disabled={zoom <= 0.1}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomIn}
              disabled={zoom >= 5}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleRotate}
            >
              <RotateCw className="h-4 w-4" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
            >
              リセット
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
            >
              <Download className="h-4 w-4" />
            </Button>
          
          </div>
        </DialogHeader>

        {/* コンテンツエリア */}
        <div className="flex-1 overflow-auto bg-gray-100 p-4">
          <div className="flex items-center justify-center min-h-full">
            {file.type.startsWith('image/') ? (
              <div
                className="transition-transform duration-200 ease-in-out"
                style={{
                  transform: `scale(${zoom}) rotate(${rotation}deg)`,
                  transformOrigin: 'center'
                }}
              >
                <img
                  src={file.url}
                  alt={file.name}
                  className="max-w-none shadow-lg"
                  style={{
                    maxHeight: '60vh',
                    maxWidth: '70vw'
                  }}
                />
              </div>
            ) : (
              <div className="text-center space-y-4 p-8">
                <FileImage className="h-24 w-24 text-gray-400 mx-auto" />
                <div className="space-y-2">
                  <h3 className="text-lg font-medium text-gray-700">
                    {file.name.split('.').pop()?.toUpperCase()} ファイル
                  </h3>
                  <p className="text-sm text-gray-500">
                    このファイル形式はプレビューできません
                  </p>
                  <Button
                    variant="outline"
                    onClick={handleDownload}
                    className="mt-4"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    ダウンロード
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}