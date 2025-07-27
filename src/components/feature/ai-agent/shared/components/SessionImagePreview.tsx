"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Paperclip, Eye } from "lucide-react";

interface SessionImagePreviewProps {
  file: File;
  onRemove: () => void;
}

export default function SessionImagePreview({ file, onRemove }: SessionImagePreviewProps) {
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
    <div className="flex items-center space-x-2 p-2 bg-green-50 border border-green-200 rounded-lg mb-2">
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
          <div className="flex items-center space-x-1">
            <Eye className="w-3 h-3 text-green-600" />
            <p className="text-xs font-medium text-green-900 truncate">セッション中参照可能</p>
          </div>
          <p className="text-xs text-green-600">{file.name} ({formatFileSize(file.size)})</p>
        </div>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onRemove}
        className="h-6 w-6 p-0 text-green-600 hover:text-green-800 hover:bg-green-100"
        title="セッション画像を削除"
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  );
}