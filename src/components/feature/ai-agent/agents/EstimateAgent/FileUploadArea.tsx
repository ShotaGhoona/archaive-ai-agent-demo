"use client";

import React, { useState, useCallback } from 'react';
import { Button } from '@/shared/shadcnui';
import { Upload, File, X, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadAreaProps {
  onFileUpload: (file: File) => void;
  acceptedTypes: string[];
  maxSize: number;
  large?: boolean;
  compact?: boolean;
}

const FileUploadArea: React.FC<FileUploadAreaProps> = ({
  onFileUpload,
  acceptedTypes,
  maxSize,
  large = false,
  compact = false
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    handleFiles(files);
  }, []);

  const handleFiles = (files: File[]) => {
    const validFiles = files.filter(file => {
      const extension = '.' + file.name.split('.').pop()?.toLowerCase();
      return acceptedTypes.includes(extension) && file.size <= maxSize;
    });

    if (validFiles.length > 0) {
      const newFiles = [...uploadedFiles, ...validFiles];
      setUploadedFiles(newFiles);
      validFiles.forEach(file => onFileUpload(file));
    }
  };

  const removeFile = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      {/* アップロード領域 */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "border-2 border-dashed rounded-lg text-center transition-colors",
          large ? "p-12" : "p-8",
          isDragOver 
            ? "border-primary bg-primary/10" 
            : "border-muted-foreground/25 hover:border-muted-foreground/50"
        )}
      >
        <Upload className={cn(
          "mx-auto mb-4 text-muted-foreground",
          large ? "w-16 h-16" : "w-12 h-12"
        )} />
        <h3 className={cn(
          "font-semibold mb-2",
          large ? "text-xl" : "text-lg"
        )}>図面ファイルをアップロード</h3>
        <p className={cn(
          "text-muted-foreground mb-4",
          large ? "text-base" : "text-sm"
        )}>
          ファイルをここにドラッグ＆ドロップするか、下のボタンから選択してください
        </p>
        <div className="space-y-2">
          <Button variant="outline" asChild size={large ? "lg" : "default"}>
            <label className="cursor-pointer">
              <input
                type="file"
                accept={acceptedTypes.join(',')}
                onChange={handleFileInput}
                className="sr-only"
              />
              ファイルを選択
            </label>
          </Button>
          <div className={cn(
            "text-muted-foreground",
            large ? "text-sm" : "text-xs"
          )}>
            対応形式: .jpg, .jpeg, .png, .webp | 最大サイズ: {formatFileSize(maxSize)}
          </div>
        </div>
      </div>

      {/* アップロードされたファイル一覧 */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-sm">アップロードされたファイル</h4>
          {uploadedFiles.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-muted rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <File className="w-4 h-4 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium">{file.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {formatFileSize(file.size)}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                  className="p-1 h-auto"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUploadArea;