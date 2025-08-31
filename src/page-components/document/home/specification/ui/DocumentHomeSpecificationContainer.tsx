'use client';
import { useState } from 'react';
import {
  documentHomeSpecificationData,
  DocumentSpecificationDataInterface,
} from '@/dummy-data-er-fix/document';
import {
  DocumentHomeSpecificationPageHeader,
  DocumentHomeSpecificationTableView,
} from '../ui';
import {
  AdvancedFilterSidebar,
  useAdvancedFilter,
  useSearchbar,
  setValue,
} from '@/shared';
import {
  SPECIFICATION_FILTER_CONFIG,
  SPECIFICATION_SEARCHBAR_CONFIG,
} from '../lib';

export function DocumentHomeSpecificationContainer() {
  const [specifications, setSpecifications] = useState<
    DocumentSpecificationDataInterface[]
  >(documentHomeSpecificationData as DocumentSpecificationDataInterface[]);

  // 検索機能
  const {
    searchTerm,
    setSearchTerm,
    filteredData: searchFiltered,
  } = useSearchbar(specifications, SPECIFICATION_SEARCHBAR_CONFIG);

  // アドバンスドフィルター機能
  const {
    filteredData: filteredSpecifications,
    isOpen: isFilterSidebarOpen,
    toggleSidebar,
    filters,
    setFilters,
    clearFilters,
  } = useAdvancedFilter(searchFiltered, SPECIFICATION_FILTER_CONFIG);

  // 仕様書削除ハンドラー
  const handleSpecificationDelete = (
    specification: DocumentSpecificationDataInterface,
  ) => {
    setSpecifications((prev) =>
      prev.filter((s) => s.id !== specification.id),
    );
  };

  // 仕様書更新ハンドラー
  const handleSpecificationUpdate = (
    rowId: string,
    field: string,
    value: unknown,
  ) => {
    setSpecifications((prev) =>
      prev.map((specification) => {
        if (specification.id.toString() === rowId) {
          const updatedSpecification = { ...specification };
          setValue(updatedSpecification, field, value);
          updatedSpecification.updated_at = new Date().toISOString();
          return updatedSpecification;
        }
        return specification;
      }),
    );
  };

  return (
    <div className='flex h-full overflow-hidden'>
      {/* フィルターサイドバー */}
      <AdvancedFilterSidebar
        isOpen={isFilterSidebarOpen}
        onToggle={toggleSidebar}
        filters={filters}
        onFiltersChange={setFilters}
        onClearFilters={clearFilters}
        config={SPECIFICATION_FILTER_CONFIG}
      />

      {/* メインコンテンツ */}
      <div
        className={`flex flex-1 flex-col overflow-hidden transition-all duration-300 ${
          isFilterSidebarOpen ? 'ml-80' : 'ml-0'
        }`}
      >
        <div className='flex-shrink-0 p-4'>
          <DocumentHomeSpecificationPageHeader
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onToggleFilterSidebar={toggleSidebar}
            isFilterSidebarOpen={isFilterSidebarOpen}
            specifications={filteredSpecifications}
          />
        </div>
        <div className='flex min-h-0 flex-1 flex-col px-4'>
          <DocumentHomeSpecificationTableView
            specifications={filteredSpecifications}
            onSpecificationDelete={handleSpecificationDelete}
            onSpecificationUpdate={handleSpecificationUpdate}
          />
        </div>
      </div>
    </div>
  );
}
