import React from 'react';
import {
  Button,
  Separator,
} from '@/shared';
import { ChevronLeft, RotateCcw } from 'lucide-react';
import { AdvancedFilterProps } from '../model';
import { FilterControl } from '../ui';

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
  title = '詳細フィルター',
  className = '',
}: AdvancedFilterProps<T>) {
  const updateFilter = (key: string, value: unknown) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

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
        <div className="flex items-center justify-between p-4 border-b bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
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

        {/* フィルター内容 */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {config.map((filterConfig, index) => (
            <React.Fragment key={filterConfig.key as string}>
              <FilterControl
                config={filterConfig}
                value={filters[filterConfig.key as string]}
                onChange={(value) => updateFilter(filterConfig.key as string, value)}
              />
              
              {/* セパレーターを適切な位置に挿入 */}
              {index < config.length - 1 && 
               index % 3 === 2 && (
                <Separator />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </>
  );
}