import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Button,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/shared/shadcnui";
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  Download, 
  FileImage,
  Layers
} from "lucide-react";
import type { CarouselApi } from "@/shared/shadcnui";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  createdAt: Date;
}

interface BlueprintViewModalProps {
  files: UploadedFile[];
  isOpen: boolean;
  onClose: () => void;
  initialFileIndex?: number;
}

export function BlueprintViewModal({ 
  files, 
  isOpen, 
  onClose, 
  initialFileIndex = 0 
}: BlueprintViewModalProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(initialFileIndex);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  const currentFile = files[current];
  const isMultipleFiles = files.length > 1;

  useEffect(() => {
    if (!api || !isMultipleFiles) return;

    api.scrollTo(initialFileIndex);
    setCurrent(initialFileIndex);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
      setZoom(1);
      setRotation(0);
    });
  }, [api, initialFileIndex, isMultipleFiles]);

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
    if (!currentFile) return;
    
    const link = document.createElement('a');
    link.href = currentFile.url;
    link.download = currentFile.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadAll = () => {
    files.forEach((file, index) => {
      setTimeout(() => {
        const link = document.createElement('a');
        link.href = file.url;
        link.download = file.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }, index * 100);
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!currentFile) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className={isMultipleFiles ? "min-w-[90vw] max-w-[90vw] max-h-[90vh] p-0 overflow-hidden" : "min-w-[80vw] max-w-[80vw] max-h-[80vh] p-0 overflow-hidden"}
      >
        {/* ヘッダー */}
        <DialogHeader className="flex flex-row items-center justify-between p-4 border-b bg-gray-50">
          <div className="flex-1">
            <DialogTitle className="text-lg font-semibold text-gray-900 truncate flex items-center gap-2">
              {isMultipleFiles && <Layers className="h-5 w-5 text-blue-600" />}
              {currentFile.name}
              {isMultipleFiles && (
                <span className="text-sm font-normal text-gray-500">
                  ({current + 1} / {files.length})
                </span>
              )}
            </DialogTitle>
            <div className="flex items-center gap-4 mt-1">
              <span className="text-sm text-gray-500">
                {formatFileSize(currentFile.size)}
              </span>
              <span className="text-sm text-gray-500">
                {currentFile.type.startsWith('image/') ? 'IMAGE' : currentFile.name.split('.').pop()?.toUpperCase()}
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

            {isMultipleFiles && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadAll}
                className="text-blue-600 hover:text-blue-700"
              >
                <Download className="h-4 w-4 mr-1" />
                全てDL
              </Button>
            )}
          </div>
        </DialogHeader>

        {/* コンテンツエリア */}
        <div className="flex-1 overflow-hidden bg-gray-100">
          {isMultipleFiles ? (
            <Carousel
              setApi={setApi}
              className="w-full h-full"
              opts={{
                align: "start",
                loop: false,
              }}
            >
              <CarouselContent className={`h-[calc(${isMultipleFiles ? '90vh' : '80vh'}-120px)]`}>
                {files.map((file, index) => (
                  <CarouselItem key={file.id} className="h-full">
                    <div className="flex items-center justify-center h-full p-4">
                      {file.type.startsWith('image/') ? (
                        <div
                          className="transition-transform duration-200 ease-in-out"
                          style={{
                            transform: `scale(${index === current ? zoom : 1}) rotate(${index === current ? rotation : 0}deg)`,
                            transformOrigin: 'center'
                          }}
                        >
                          <img
                            src={file.url}
                            alt={file.name}
                            className="max-w-none shadow-lg"
                            style={{
                              maxHeight: index === current ? '70vh' : '60vh',
                              maxWidth: '80vw'
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
                              onClick={() => {
                                const link = document.createElement('a');
                                link.href = file.url;
                                link.download = file.name;
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                              }}
                              className="mt-4"
                            >
                              <Download className="h-4 w-4 mr-2" />
                              ダウンロード
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              
              <CarouselPrevious className="left-4" />
              <CarouselNext className="right-4" />
              
              {/* インジケーター */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
                <div className="flex items-center space-x-2 bg-black/50 backdrop-blur-sm rounded-full px-3 py-2">
                  {files.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => api?.scrollTo(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-200 ${
                        index === current ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/75'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </Carousel>
          ) : (
            <div className="flex items-center justify-center h-full p-4">
              {currentFile.type.startsWith('image/') ? (
                <div
                  className="transition-transform duration-200 ease-in-out"
                  style={{
                    transform: `scale(${zoom}) rotate(${rotation}deg)`,
                    transformOrigin: 'center'
                  }}
                >
                  <img
                    src={currentFile.url}
                    alt={currentFile.name}
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
                      {currentFile.name.split('.').pop()?.toUpperCase()} ファイル
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
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}