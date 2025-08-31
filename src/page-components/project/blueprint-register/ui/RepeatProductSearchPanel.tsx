'use client';
import { useState } from 'react';
import { List, Grid3X3 } from 'lucide-react';
import {
  Button,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  SearchInput,
} from '@/shared';
import { TableView } from '@/shared/view/table-view';
import { GalleryView } from '@/shared/view/gallery-view';
import { blueprintHomeData,  DrawingPageBaseDataInterface } from '@/dummy-data-er-fix/blueprint';
import {
  createRepeatBlueprintGalleryConfig,
  createRepeatBlueprintTableConfig,
} from '../lib';

interface RepeatProductSearchPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RepeatProductSearchPanel({
  isOpen,
}: RepeatProductSearchPanelProps) {
  const [viewMode, setViewMode] = useState<'table' | 'gallery'>('gallery');
  const [searchTerm, setSearchTerm] = useState('');

  const blueprints: DrawingPageBaseDataInterface[] = blueprintHomeData;

  // 検索フィルタリング
  const filteredBlueprints = blueprints.filter(
    (blueprint) =>
      (blueprint.drawing_file_name || '')
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (blueprint.leaf_product_name || '')
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (blueprint.customer_name || '')
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (blueprint.customer_name || '')
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
  );

  // リピート品登録処理
  const handleRepeatRegister = (blueprint: DrawingPageBaseDataInterface) => {
    console.log('リピート品として登録:', blueprint);
    // TODO: 実際のリピート品登録処理を実装
  };

  // Gallery設定
  const galleryConfig = createRepeatBlueprintGalleryConfig({
    onRepeatRegister: handleRepeatRegister,
  });

  // Table設定
  const tableConfig = createRepeatBlueprintTableConfig({
    onRepeatRegister: handleRepeatRegister,
  });

  if (!isOpen) return null;

  return (
    <div className='max-w-1/2 min-w-1/2 p-4'>
      <div className='animate-in slide-in-from-right-full flex h-full flex-col rounded-lg border border-gray-200 bg-gray-50 shadow-lg duration-300'>
        {/* 検索・フィルターヘッダー */}
        <div className='flex items-center gap-5 px-6 py-4'>
          <div className='bg-background flex items-center gap-1 rounded-lg border border-gray-200'>
            <Tooltip delayDuration={500}>
              <TooltipTrigger asChild>
                <Button
                  variant={viewMode === 'table' ? 'default' : 'ghost'}
                  size='lg'
                  onClick={() => setViewMode('table')}
                  className='h-10 w-10 p-0'
                >
                  <List className='h-5 w-5' />
                </Button>
              </TooltipTrigger>
              <TooltipContent side='bottom'>テーブルビュー</TooltipContent>
            </Tooltip>
            <Tooltip delayDuration={500}>
              <TooltipTrigger asChild>
                <Button
                  variant={viewMode === 'gallery' ? 'default' : 'ghost'}
                  size='lg'
                  onClick={() => setViewMode('gallery')}
                  className='h-10 w-10 p-0'
                >
                  <Grid3X3 className='h-5 w-5' />
                </Button>
              </TooltipTrigger>
              <TooltipContent side='bottom'>ギャラリービュー</TooltipContent>
            </Tooltip>
          </div>
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder='ファイル名、発注元、製品名、整番で検索'
          />
        </div>

        {/* メインコンテンツ */}
        <div className='flex min-h-0 flex-1 flex-col px-4'>
          {viewMode === 'table' ? (
            <TableView data={filteredBlueprints} config={tableConfig} />
          ) : (
            <GalleryView data={filteredBlueprints} config={galleryConfig} />
          )}
        </div>
      </div>
    </div>
  );
}
