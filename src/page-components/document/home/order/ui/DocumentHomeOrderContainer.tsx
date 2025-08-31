'use client';
import { useState } from 'react';
import {
  documentHomeOrderData,
  DocumentOrderDataInterface,
} from '@/dummy-data-er-fix/document';
import { DocumentHomeOrderPageHeader, DocumentHomeOrderTableView } from '../ui';
import {
  AdvancedFilterSidebar,
  useAdvancedFilter,
  useSearchbar,
  setValue,
} from '@/shared';
import { ORDER_FILTER_CONFIG, ORDER_SEARCHBAR_CONFIG } from '../lib';

export function DocumentHomeOrderContainer() {
  const [orders, setOrders] = useState<DocumentOrderDataInterface[]>(
    documentHomeOrderData as DocumentOrderDataInterface[],
  );

  // 検索機能
  const {
    searchTerm,
    setSearchTerm,
    filteredData: searchFiltered,
  } = useSearchbar(orders, ORDER_SEARCHBAR_CONFIG);

  // アドバンスドフィルター機能
  const {
    filteredData: filteredOrders,
    isOpen: isFilterSidebarOpen,
    toggleSidebar,
    filters,
    setFilters,
    clearFilters,
  } = useAdvancedFilter(searchFiltered, ORDER_FILTER_CONFIG);

  // 発注書削除ハンドラー
  const handleOrderDelete = (order: DocumentOrderDataInterface) => {
    setOrders((prev) =>
      prev.filter((o) => o.id !== order.id),
    );
  };

  // 発注書更新ハンドラー
  const handleOrderUpdate = (
    rowId: string,
    field: string,
    value: unknown,
  ) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id.toString() === rowId) {
          const updatedOrder = { ...order };
          setValue(updatedOrder, field, value);
          updatedOrder.updated_at = new Date().toISOString();
          return updatedOrder;
        }
        return order;
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
        config={ORDER_FILTER_CONFIG}
      />

      {/* メインコンテンツ */}
      <div
        className={`flex flex-1 flex-col overflow-hidden transition-all duration-300 ${
          isFilterSidebarOpen ? 'ml-80' : 'ml-0'
        }`}
      >
        <div className='flex-shrink-0 p-4'>
          <DocumentHomeOrderPageHeader
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onToggleFilterSidebar={toggleSidebar}
            isFilterSidebarOpen={isFilterSidebarOpen}
            orders={filteredOrders}
          />
        </div>
        <div className='flex min-h-0 flex-1 flex-col px-4'>
          <DocumentHomeOrderTableView
            orders={filteredOrders}
            onOrderDelete={handleOrderDelete}
            onOrderUpdate={handleOrderUpdate}
          />
        </div>
      </div>
    </div>
  );
}
