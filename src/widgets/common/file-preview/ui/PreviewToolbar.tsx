import React from 'react';
import { Button } from '@/shared';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  Download, 
  Layers
} from 'lucide-react';
import { PreviewableFile, PreviewAction } from '../model';

interface PreviewToolbarProps {
  currentFile: PreviewableFile;
  zoom: number;
  canZoomIn: boolean;
  canZoomOut: boolean;
  isMultipleFiles: boolean;
  filesCount: number;
  currentIndex: number;
  enableDownload?: boolean;
  enableRotation?: boolean;
  customActions?: PreviewAction[];
  onZoomIn: () => void;
  onZoomOut: () => void;
  onRotate: () => void;
  onReset: () => void;
  onDownload: () => void;
  onDownloadAll?: () => void;
}

export function PreviewToolbar({
  currentFile,
  zoom,
  canZoomIn,
  canZoomOut,
  isMultipleFiles,
  filesCount,
  currentIndex,
  enableDownload = true,
  enableRotation = true,
  customActions = [],
  onZoomIn,
  onZoomOut,
  onRotate,
  onReset,
  onDownload,
  onDownloadAll
}: PreviewToolbarProps) {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="flex flex-row items-center justify-between p-4 border-b bg-gray-50">
      <div className="flex-1">
        <div className="text-lg font-semibold text-gray-900 truncate flex items-center gap-2">
          {isMultipleFiles && <Layers className="h-5 w-5 text-blue-600" />}
          {currentFile.name}
          {isMultipleFiles && (
            <span className="text-sm font-normal text-gray-500">
              ({currentIndex + 1} / {filesCount})
            </span>
          )}
        </div>
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
      
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onZoomOut}
          disabled={!canZoomOut}
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onZoomIn}
          disabled={!canZoomIn}
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        
        {enableRotation && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRotate}
          >
            <RotateCw className="h-4 w-4" />
          </Button>
        )}
        
        <Button
          variant="outline"
          size="sm"
          onClick={onReset}
        >
          リセット
        </Button>
        
        {enableDownload && (
          <Button
            variant="outline"
            size="sm"
            onClick={onDownload}
          >
            <Download className="h-4 w-4" />
          </Button>
        )}

        {isMultipleFiles && enableDownload && onDownloadAll && (
          <Button
            variant="outline"
            size="sm"
            onClick={onDownloadAll}
            className="text-blue-600 hover:text-blue-700"
          >
            <Download className="h-4 w-4 mr-1" />
            全てDL
          </Button>
        )}

        {/* カスタムアクション */}
        {customActions.map((action) => (
          <Button
            key={action.id}
            variant={action.variant || "outline"}
            size="sm"
            onClick={() => action.onClick(currentFile)}
            disabled={action.disabled}
          >
            {action.icon}
            {action.label}
          </Button>
        ))}
      </div>
    </div>
  );
}