'use client';
import React, { useState } from 'react';
import {
  Button,
  TabNavigation,
} from '@/shared';
import { ChevronLeft, RotateCcw, Search, Settings } from 'lucide-react';
import { AdvancedFilterProps } from '../model';
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
  className = '',
}: AdvancedFilterProps<T>) {
  const [activeTab, setActiveTab] = useState('simple');
  
  const updateFilter = (key: string, value: unknown) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
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
          w-80 flex flex-col ${className}
        `}
      >
        {/* ヘッダー */}
        <div className="flex items-center justify-between p-4 bg-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">詳細フィルター</h2>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onClearFilters}
              className="text-xs"
            >
              <RotateCcw className="h-3 w-3 mr-1" />
              クリア
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>
        </div>
        {/* 切り替えタブ */}
        <TabNavigation
          items={tabItems}
          selectedKey={activeTab}
          onTabChange={setActiveTab}
        />

        {/* フィルター内容 */}
        {activeTab === 'simple' && (
          <SimpleFilterContent
            config={config}
            filters={filters}
            updateFilter={updateFilter}
          />
        )}
        {activeTab === 'advanced' && (
          <AdvancedFilterContent
            config={config}
            filters={filters}
            updateFilter={updateFilter}
          />
        )}
      </div>
    </>
  );
}