'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Button,
} from '@/shared';
import { Upload, FileText, Plus } from 'lucide-react';

interface QuotationRegistrationDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QuotationRegistrationDialog({
  isOpen,
  onClose,
}: QuotationRegistrationDialogProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const { projectId } = useParams();
  const router = useRouter();

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
    console.log('見積書ファイルがアップロードされました');
    // TODO: ファイルアップロード処理
    onClose();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      console.log('見積書ファイルがアップロードされました');
      // TODO: ファイルアップロード処理
      onClose();
    }
  };

  const handleCreateQuotation = () => {
    router.push(`/project/${projectId}/quotation-create`);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='min-w-4xl'>
        <DialogHeader>
          <DialogTitle>見積書を登録または作成</DialogTitle>
        </DialogHeader>

        <div className='grid grid-cols-2 gap-6 py-6'>
          <div
            className={`flex h-full cursor-pointer flex-col items-center justify-center space-y-4 rounded-lg border-2 border-dashed transition-colors ${
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
                既存の見積書をアップロード
              </h3>
              <p
                className={`text-sm ${isDragOver ? 'text-blue-700' : 'text-gray-600'}`}
              >
                ファイルをドラッグ&ドロップまたはクリックして選択
              </p>
              <p className='text-xs text-gray-500'>PDF, JPG, PNG形式対応</p>
            </div>
          </div>

          <div
            className='flex h-full cursor-pointer flex-col items-center justify-center space-y-4 rounded-lg border-2 border-dashed border-gray-300 transition-colors hover:border-gray-400'
            onClick={handleCreateQuotation}
          >
            <FileText className='h-12 w-12 text-gray-400' />
            <div className='space-y-2 text-center'>
              <h3 className='text-lg font-medium text-gray-900'>
                ARCHAIVEで見積書を作成
              </h3>
              <Button className='mt-4'>
                <Plus className='mr-2 h-4 w-4' />
                見積書を作成する
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
