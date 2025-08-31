'use client';
import { useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/shared';
import {
  BlueprintUploadGallery,
  RepeatProductSearchPanel,
  BlueprintUploadButton,
} from '../ui';

export function BlueprintRegisterContainer() {
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);

  const handleRepeatSearch = () => {
    setIsRightPanelOpen(true);
  };

  const handleCloseRightPanel = () => {
    setIsRightPanelOpen(false);
  };

  const handleFileUpload = (files: FileList) => {
    console.log('Files to upload:', Array.from(files));
    // TODO: ファイルアップロード処理を実装
  };

  return (
    <div className='flex h-full bg-white'>
      {/* メインコンテンツエリア */}
      <div className='flex h-full flex-col overflow-hidden'>
        {/* ページヘッダー */}
        <div className='flex-shrink-0 flex items-center justify-between p-6 pb-0'>
          <h3 className='text-lg font-semibold'>図面登録</h3>
          <div className='flex items-center gap-3'>
            <BlueprintUploadButton onFileUpload={handleFileUpload} />
            <Button
              onClick={
                isRightPanelOpen ? handleCloseRightPanel : handleRepeatSearch
              }
              size='lg'
            >
              <Search className='mr-2 h-4 w-4' />
              {isRightPanelOpen ? 'パネルを閉じる' : 'リピート品を探す'}
            </Button>
          </div>
        </div>
        {/* 図面アップロードギャラリー */}
        <div className='flex-1 overflow-hidden transition-all duration-300'>
          <BlueprintUploadGallery />
        </div>
      </div>
      {/* リピート品検索パネル */}
      <RepeatProductSearchPanel
        isOpen={isRightPanelOpen}
        onClose={handleCloseRightPanel}
      />
    </div>
  );
}
