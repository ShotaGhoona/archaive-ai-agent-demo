"use client";

import { useState, useEffect } from "react";
import { Button } from "@/shared/shadcnui";
import { X, Paperclip } from "lucide-react";

interface AttachedFilePreviewProps {
  file: File;
  onRemove: () => void;
}

export default function AttachedFilePreview({ file, onRemove }: AttachedFilePreviewProps) {
  const [previewUrl, setPreviewUrl] = useState<string>('');

  useEffect(() => {
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [file]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="flex items-center space-x-2 p-2 bg-blue-50 border border-blue-200 rounded-lg mb-2">
      <div className="flex items-center space-x-2 flex-1">
        {previewUrl ? (
          <img 
            src={previewUrl} 
            alt={file.name} 
            className="w-8 h-8 object-cover rounded border"
          />
        ) : (
          <div className="w-8 h-8 bg-gray-200 rounded border flex items-center justify-center">
            <Paperclip className="w-4 h-4 text-gray-500" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-blue-900 truncate">{file.name}</p>
          <p className="text-xs text-blue-600">{formatFileSize(file.size)}</p>
        </div>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onRemove}
        className="h-6 w-6 p-0 text-blue-600 hover:text-blue-800 hover:bg-blue-100"
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  );
}