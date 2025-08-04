"use client";

import { X, File } from 'lucide-react';
import { Button } from '@/shared/shadcnui';

interface AttachedFilePreviewProps {
  file: File;
  onRemove: () => void;
}

const AttachedFilePreview: React.FC<AttachedFilePreviewProps> = ({ file, onRemove }) => {
  const getFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="mb-2 p-2 bg-gray-50 rounded-lg flex items-center justify-between">
      <div className="flex items-center gap-2">
        <File className="h-5 w-5 text-gray-500" />
        <div>
          <p className="text-sm font-medium text-gray-700">{file.name}</p>
          <p className="text-xs text-gray-500">{getFileSize(file.size)}</p>
        </div>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={onRemove}
        className="h-6 w-6 p-0"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default AttachedFilePreview;