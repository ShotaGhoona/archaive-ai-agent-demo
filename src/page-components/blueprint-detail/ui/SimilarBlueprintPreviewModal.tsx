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
  X
} from "lucide-react";

interface SimilarBlueprint {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  similarity: number;
  createdAt: string;
}

interface SimilarBlueprintPreviewModalProps {
  blueprint: SimilarBlueprint | null;
  isOpen: boolean;
  onClose: () => void;
}

export function SimilarBlueprintPreviewModal({ 
  blueprint, 
  isOpen, 
  onClose 
}: SimilarBlueprintPreviewModalProps) {
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
    if (!blueprint) return;
    const link = document.createElement('a');
    link.href = blueprint.imageUrl;
    link.download = blueprint.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // モーダルが閉じるときにリセット
  const handleClose = () => {
    setZoom(1);
    setRotation(0);
    onClose();
  };

  if (!blueprint) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent 
        className="min-w-[80vw] max-w-[80vw] max-h-[80vh] p-0 overflow-hidden"
      >
        {/* ヘッダー */}
        <DialogHeader className="flex flex-row items-center justify-between p-4 border-b bg-gray-50">
          <div className="flex-1">
            <DialogTitle className="text-lg font-semibold text-gray-900 truncate">
              {blueprint.name}
            </DialogTitle>
            <div className="flex items-center gap-4 mt-1">
              <span className="text-sm text-gray-500">
                類似度: {blueprint.similarity}%
              </span>
              <span className="text-sm text-gray-500">
                {new Date(blueprint.createdAt).toLocaleDateString('ja-JP')}
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
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        {/* コンテンツエリア */}
        <div className="flex-1 overflow-auto bg-gray-100 p-4">
          <div className="flex items-center justify-center min-h-full">
            <div
              className="transition-transform duration-200 ease-in-out"
              style={{
                transform: `scale(${zoom}) rotate(${rotation}deg)`,
                transformOrigin: 'center'
              }}
            >
              <img
                src={blueprint.imageUrl}
                alt={blueprint.name}
                className="max-w-none shadow-lg"
                style={{
                  maxHeight: '60vh',
                  maxWidth: '70vw'
                }}
              />
            </div>
          </div>
        </div>
        
        {/* 説明エリア */}
        {blueprint.description && (
          <div className="border-t bg-white p-4">
            <p className="text-sm text-gray-600">
              {blueprint.description}
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}