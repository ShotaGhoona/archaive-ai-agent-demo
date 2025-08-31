'use client';
import { useState } from 'react';
import {
  documentHomeDeliveryData,
  DocumentDeliveryDataInterface,
} from '@/dummy-data-er-fix/document';
import {
  DocumentHomeDeliveryPageHeader,
  DocumentHomeDeliveryTableView,
} from '../ui';
import {
  AdvancedFilterSidebar,
  useAdvancedFilter,
  useSearchbar,
  setValue,
} from '@/shared';
import { DELIVERY_FILTER_CONFIG, DELIVERY_SEARCHBAR_CONFIG } from '../lib';

export function DocumentHomeDeliveryContainer() {
  const [deliveries, setDeliveries] = useState<DocumentDeliveryDataInterface[]>(
    documentHomeDeliveryData as DocumentDeliveryDataInterface[],
  );

  // 検索機能
  const {
    searchTerm,
    setSearchTerm,
    filteredData: searchFiltered,
  } = useSearchbar(deliveries, DELIVERY_SEARCHBAR_CONFIG);

  // アドバンスドフィルター機能
  const {
    filteredData: filteredDeliveries,
    isOpen: isFilterSidebarOpen,
    toggleSidebar,
    filters,
    setFilters,
    clearFilters,
  } = useAdvancedFilter(searchFiltered, DELIVERY_FILTER_CONFIG);

  // 納品書削除ハンドラー
  const handleDeliveryDelete = (delivery: DocumentDeliveryDataInterface) => {
    setDeliveries((prev) =>
      prev.filter((d) => d.id !== delivery.id),
    );
  };

  // 納品書更新ハンドラー
  const handleDeliveryUpdate = (
    rowId: string,
    field: string,
    value: unknown,
  ) => {
    setDeliveries((prev) =>
      prev.map((delivery) => {
        if (delivery.id.toString() === rowId) {
          const updatedDelivery = { ...delivery };
          setValue(updatedDelivery, field, value);
          updatedDelivery.updated_at = new Date().toISOString();
          return updatedDelivery;
        }
        return delivery;
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
        config={DELIVERY_FILTER_CONFIG}
      />

      {/* メインコンテンツ */}
      <div
        className={`flex flex-1 flex-col overflow-hidden transition-all duration-300 ${
          isFilterSidebarOpen ? 'ml-80' : 'ml-0'
        }`}
      >
        <div className='flex-shrink-0 p-4'>
          <DocumentHomeDeliveryPageHeader
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onToggleFilterSidebar={toggleSidebar}
            isFilterSidebarOpen={isFilterSidebarOpen}
            deliveries={filteredDeliveries}
          />
        </div>
        <div className='flex min-h-0 flex-1 flex-col px-4'>
          <DocumentHomeDeliveryTableView
            deliveries={filteredDeliveries}
            onDeliveryDelete={handleDeliveryDelete}
            onDeliveryUpdate={handleDeliveryUpdate}
          />
        </div>
      </div>
    </div>
  );
}
