'use client';
import React, { useState } from 'react';
import {
  Button,
  TabNavigation,
} from '@/shared';
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
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}
      
      {/* サイドバー */}
      <div
        className={`
          fixed left-0 top-[45px] h-[calc(100vh-45px)] bg-white border-r shadow-lg z-50 transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          w-80 flex flex-col
        `}
      >
        {/* 切り替えタブ */}
        <TabNavigation
          items={tabItems}
          selectedKey={activeTab}
          onTabChange={setActiveTab}
        />

        {/* フィルター内容 */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-hidden">
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
          <div className="p-4 border-t bg-white grid grid-cols-3 gap-2 flex-shrink-0">
            <Button
              variant="outline"
              onClick={handleClearFilters}
              className="w-full col-span-1"
              size="lg"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              クリア
            </Button>
            <Button
              onClick={handleApplyFilters}
              className="w-full col-span-2"
              size="lg"
            >
              <Search className="h-4 w-4 mr-2" />
              フィルターを適用
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}