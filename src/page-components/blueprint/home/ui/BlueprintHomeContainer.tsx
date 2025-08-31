'use client';
import { useState } from 'react';
import {
  BlueprintPageHeader,
  BlueprintTableView,
  BlueprintGalleryView,
} from '../ui';
import {
  AdvancedFilterSidebar,
  useAdvancedFilter,
  useSearchbar,
} from '@/shared';
import { setValue } from '@/shared';
import {
  DrawingPageBaseDataInterface,
  blueprintHomeData,
} from '@/dummy-data-er-fix/blueprint';
import { BLUEPRINT_FILTER_CONFIG, BLUEPRINT_SEARCHBAR_CONFIG } from '../lib';

export function BlueprintHomeContainer() {
  const [viewMode, setViewMode] = useState<'table' | 'gallery'>('table');
  const [blueprints, setBlueprints] = useState<DrawingPageBaseDataInterface[]>(
    blueprintHomeData as DrawingPageBaseDataInterface[],
  );

  // 分離アプローチ: 検索とAdvanced Filterを独立管理
  const {
    searchTerm,
    setSearchTerm,
    selectedFilter,
    setSelectedFilter,
    filteredData: searchFiltered,
  } = useSearchbar(blueprints, BLUEPRINT_SEARCHBAR_CONFIG);

  const {
    filteredData: filteredBlueprints,
    isOpen: isFilterSidebarOpen,
    toggleSidebar,
    filters,
    setFilters,
    clearFilters,
  } = useAdvancedFilter(searchFiltered, BLUEPRINT_FILTER_CONFIG);

  // 図面更新ハンドラー
  const handleBlueprintUpdate = (
    rowId: string,
    field: string,
    value: unknown,
  ) => {
    setBlueprints((prev) =>
      prev.map((blueprint) => {
        if (blueprint.id.toString() === rowId) {
          const updatedBlueprint = { ...blueprint };
          setValue(updatedBlueprint, field, value);
          updatedBlueprint.updated_at = new Date().toISOString();
          return updatedBlueprint;
        }
        return blueprint;
      }),
    );
  };

  return (
    <div className='flex h-[calc(100vh-45px)] overflow-hidden'>
      {/* フィルターサイドバー */}
      <AdvancedFilterSidebar
        isOpen={isFilterSidebarOpen}
        onToggle={toggleSidebar}
        filters={filters}
        onFiltersChange={setFilters}
        onClearFilters={clearFilters}
        config={BLUEPRINT_FILTER_CONFIG}
      />

      {/* メインコンテンツ */}
      <div
        className={`flex flex-1 flex-col overflow-hidden transition-all duration-300 ${
          isFilterSidebarOpen ? 'ml-80' : 'ml-0'
        }`}
      >
        <div className='flex-shrink-0 p-4'>
          <BlueprintPageHeader
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedFilter={selectedFilter}
            setSelectedFilter={setSelectedFilter}
            viewMode={viewMode}
            setViewMode={setViewMode}
            onToggleFilterSidebar={toggleSidebar}
            isFilterSidebarOpen={isFilterSidebarOpen}
            blueprints={filteredBlueprints}
          />
        </div>
        <div className='flex min-h-0 flex-1 flex-col px-4'>
          {viewMode === 'table' && (
            <BlueprintTableView
              blueprints={filteredBlueprints}
              onBlueprintUpdate={handleBlueprintUpdate}
            />
          )}
          {viewMode === 'gallery' && (
            <BlueprintGalleryView blueprints={filteredBlueprints} />
          )}
        </div>
      </div>
    </div>
  );
}
