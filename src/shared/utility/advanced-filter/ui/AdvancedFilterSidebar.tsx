'use client';
import React, { useState } from 'react';
import { Button, TabNavigation } from '@/shared';
import { RotateCcw, Search, Settings } from 'lucide-react';
import { AdvancedFilterProps, FilterState } from '../model';
import { SimpleFilterContent, AdvancedFilterContent } from '../ui';

/**
 * 高度なフィルター機能を提供するサイドバーコンポーネント
 */
export function AdvancedFilterSidebar<T>({
  isOpen,
  onToggle,
  filters,
  onFiltersChange,
  onClearFilters,
  config,
}: AdvancedFilterProps<T>) {
  const [activeTab, setActiveTab] = useState('simple');
  const [pendingFilters, setPendingFilters] = useState<FilterState<T>>(filters);

  const updateFilter = (key: string, value: unknown) => {
    setPendingFilters({
      ...pendingFilters,
      [key]: value,
    });
  };

  const handleApplyFilters = () => {
    onFiltersChange(pendingFilters);
  };

  const handleClearFilters = () => {
    setPendingFilters({} as FilterState<T>);
    onClearFilters();
  };

  const tabItems = [
    {
      key: 'simple',
      label: 'シンプル検索',
      icon: Search,
    },
    {
      key: 'advanced',
      label: '高度な検索',
      icon: Settings,
    },
  ];

  return (
    <>
      {/* オーバーレイ */}
      {isOpen && (
        <div
          className='bg-opacity-50 fixed inset-0 z-40 bg-black lg:hidden'
          onClick={onToggle}
        />
      )}

      {/* サイドバー */}
      <div
        className={`fixed top-[45px] left-0 z-50 h-[calc(100vh-45px)] border-r bg-white shadow-lg transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} flex w-80 flex-col`}
      >
        {/* 切り替えタブ */}
        <TabNavigation
          items={tabItems}
          selectedKey={activeTab}
          onTabChange={setActiveTab}
        />

        {/* フィルター内容 */}
        <div className='flex min-h-0 flex-1 flex-col'>
          <div className='flex-1 overflow-hidden'>
            {activeTab === 'simple' && (
              <SimpleFilterContent
                config={config}
                filters={pendingFilters}
                updateFilter={updateFilter}
              />
            )}
            {activeTab === 'advanced' && (
              <AdvancedFilterContent
                config={config}
                filters={pendingFilters}
                updateFilter={updateFilter}
              />
            )}
          </div>

          {/* 固定ボタン */}
          <div className='grid flex-shrink-0 grid-cols-3 gap-2 border-t bg-white p-4'>
            <Button
              variant='outline'
              onClick={handleClearFilters}
              className='col-span-1 w-full'
              size='lg'
            >
              <RotateCcw className='mr-2 h-4 w-4' />
              クリア
            </Button>
            <Button
              onClick={handleApplyFilters}
              className='col-span-2 w-full'
              size='lg'
            >
              <Search className='mr-2 h-4 w-4' />
              フィルターを適用
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
