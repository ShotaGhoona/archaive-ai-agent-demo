"use client";
import { useState } from "react";
import { orderData } from "../data";
import { DocumentHomeOrderPageHeader, DocumentHomeOrderTableView } from "../ui";
import { AdvancedFilterSidebar, useAdvancedFilter, useSearchbar } from "@/shared";
import { ORDER_FILTER_CONFIG, ORDER_SEARCHBAR_CONFIG } from "../lib";
import { Order } from "../model";
import { DocumentLayoutContainer } from "@/widgets";

export function DocumentHomeOrderContainer() {
  const [orders, setOrders] = useState<Order[]>(orderData as Order[]);

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
  const handleOrderDelete = (order: Order) => {
    setOrders(prev => prev.filter(o => o.id !== order.id));
  };

  // 発注書更新ハンドラー
  const handleOrderUpdate = (rowId: string, field: string, value: unknown) => {
    setOrders(prev => prev.map(order => 
      order.id.toString() === rowId 
        ? { ...order, [field]: value }
        : order
    ));
  };

  return (
    <DocumentLayoutContainer activeType="order">
      <div className="h-full flex overflow-hidden">
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
          className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${
            isFilterSidebarOpen ? 'ml-80' : 'ml-0'
          }`}
        >
          <div className="flex-shrink-0 p-4">
            <DocumentHomeOrderPageHeader
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              onToggleFilterSidebar={toggleSidebar}
              isFilterSidebarOpen={isFilterSidebarOpen}
              orders={filteredOrders}
            />
          </div>
          <div className="flex-1 flex flex-col min-h-0 px-4">
            <DocumentHomeOrderTableView 
              orders={filteredOrders}
              onOrderDelete={handleOrderDelete}
              onOrderUpdate={handleOrderUpdate}
            />
          </div>
        </div>
      </div>
    </DocumentLayoutContainer>
  );
}