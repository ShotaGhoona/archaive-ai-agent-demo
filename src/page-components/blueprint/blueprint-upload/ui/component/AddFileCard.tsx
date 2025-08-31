'use client';
import { useState, useRef } from 'react';
import { Badge, LoadingSpinner } from '@/shared';
import { Plus } from 'lucide-react';
import { AddFileCardProps, FileUploadData } from '../../model';

export function AddFileCard({ onAddFiles }: AddFileCardProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (fileList: FileList) => {
    const validFiles = Array.from(fileList).filter(
      (file) =>
        file.type.startsWith('image/') ||
        file.name.endsWith('.dwg') ||
        file.name.endsWith('.step') ||
        file.name.endsWith('.igs') ||
        file.name.endsWith('.pdf'),
    );

    if (validFiles.length > 0) {
      setIsUploading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const fileData: FileUploadData[] = validFiles.map((file) => ({
          name: file.name,
          size: file.size,
          type: file.type,
          url: URL.createObjectURL(file),
        }));

        onAddFiles(fileData);
      } catch (error) {
        console.error('アップロードエラー:', error);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (fileList && fileList.length > 0) {
      handleFileSelect(fileList);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const fileList = e.dataTransfer.files;
    if (fileList && fileList.length > 0) {
      handleFileSelect(fileList);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  return (
    <div
      className={`relative flex cursor-pointer items-center justify-center rounded-xl border-2 border-dashed transition-all duration-200 ${dragActive ? 'border-primary bg-primary/5' : 'hover:border-primary/50 border-gray-300'} ${isUploading ? 'border-blue-400 bg-blue-50/50' : 'bg-gray-50/50 hover:bg-gray-50'} `}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={() => !isUploading && fileInputRef.current?.click()}
    >
      <input
        ref={fileInputRef}
        type='file'
        multiple
        accept='.dwg,.step,.igs,.png,.jpg,.jpeg,.pdf'
        onChange={handleFileInputChange}
        className='hidden'
      />

      <div className='flex aspect-video flex-col items-center justify-center p-8'>
        {isUploading ? (
          <div className='space-y-4 text-center'>
            <LoadingSpinner
              size='lg'
              className='mx-auto border-blue-500/30 border-t-blue-500'
            />
            <p className='text-sm font-medium text-blue-600'>
              アップロード中...
            </p>
          </div>
        ) : (
          <div className='space-y-4 text-center'>
            <div className='flex items-center justify-center gap-2 rounded-full border bg-white p-3 shadow-sm'>
              <Plus className='h-8 w-8 text-gray-400' />
              <p className='text-sm font-bold text-gray-400'>
                図面をアップロード
              </p>
            </div>
            <div className='space-y-2'>
              <p className='text-xs text-gray-500'>
                ドラッグ&ドロップまたはクリック
              </p>
              <div className='flex flex-wrap justify-center gap-1 pt-2'>
                <Badge variant='outline' className='text-xs'>
                  DWG
                </Badge>
                <Badge variant='outline' className='text-xs'>
                  STEP
                </Badge>
                <Badge variant='outline' className='text-xs'>
                  IGS
                </Badge>
                <Badge variant='outline' className='text-xs'>
                  PDF
                </Badge>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
