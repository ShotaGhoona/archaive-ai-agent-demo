'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Button,
} from '@/shared';
import { Upload, FileText, Plus } from 'lucide-react';

interface DocumentRegistrationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  documentType?: string; // "受注書", "納品書" etc.
  createConfig?: {
    enabled: boolean;
    createPath?: string;
  };
}

export function DocumentRegistrationDialog({
  isOpen,
  onClose,
  documentType = '帳票',
  createConfig,
}: DocumentRegistrationDialogProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    console.log(`${documentType}ファイルがアップロードされました`);
    onClose();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      console.log(`${documentType}ファイルがアップロードされました`);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='min-w-4xl'>
        <DialogHeader>
          <DialogTitle>{documentType}を登録または作成</DialogTitle>
        </DialogHeader>

        <div className='grid grid-cols-2 gap-6 py-6'>
          <div
            className={`flex h-full cursor-pointer flex-col items-center justify-center space-y-4 rounded-lg border-2 border-dashed p-10 transition-colors ${
              isDragOver
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            } `}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-input')?.click()}
          >
            <input
              id='file-input'
              type='file'
              multiple
              accept='.pdf,.jpg,.jpeg,.png'
              onChange={handleFileInputChange}
              className='hidden'
            />

            <Upload
              className={`h-12 w-12 ${isDragOver ? 'text-blue-500' : 'text-gray-400'}`}
            />
            <div className='space-y-2 text-center'>
              <h3 className='text-lg font-medium text-gray-900'>
                既存の{documentType}をアップロード
              </h3>
              <p
                className={`text-sm ${isDragOver ? 'text-blue-700' : 'text-gray-600'}`}
              >
                ファイルをドラッグ&ドロップまたはクリックして選択
              </p>
              <p className='text-xs text-gray-500'>PDF, JPG, PNG形式対応</p>
            </div>
          </div>

          {createConfig?.enabled && createConfig?.createPath ? (
            <Link href={createConfig.createPath} onClick={onClose}>
              <div className='flex h-full cursor-pointer flex-col items-center justify-center space-y-4 rounded-lg border-2 border-dashed border-gray-300 transition-colors hover:border-gray-400'>
                <FileText className='h-12 w-12 text-gray-400' />
                <div className='space-y-2 text-center'>
                  <h3 className='text-lg font-medium text-gray-900'>
                    ARCHAIVEで{documentType}を作成
                  </h3>
                  <Button className='mt-4'>
                    <Plus className='mr-2 h-4 w-4' />
                    {documentType}を作成する
                  </Button>
                </div>
              </div>
            </Link>
          ) : (
            <div className='flex h-full flex-col items-center justify-center space-y-4 rounded-lg border-2 border-dashed border-gray-200 p-10 opacity-50'>
              <FileText className='h-12 w-12 text-gray-300' />
              <div className='space-y-2 text-center'>
                <h3 className='text-lg font-medium text-gray-500'>
                  ARCHAIVEで{documentType}を作成
                </h3>
                <p className='text-sm text-gray-400'>機能は実装されていません</p>
                <Button disabled className='mt-4'>
                  <Plus className='mr-2 h-4 w-4' />
                  {documentType}を作成する
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
