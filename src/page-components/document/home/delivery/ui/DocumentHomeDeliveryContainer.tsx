"use client";
import { useState } from "react";
import { deliveryData } from "../data";
import { DocumentHomeDeliveryPageHeader, DocumentHomeDeliveryTableView } from "../ui";
import { AdvancedFilterSidebar, useAdvancedFilter, useSearchbar } from "@/shared";
import { DELIVERY_FILTER_CONFIG, DELIVERY_SEARCHBAR_CONFIG } from "../lib";
import { Delivery } from "../model";
import { DocumentLayoutContainer } from "@/widgets";

export function DocumentHomeDeliveryContainer() {
  const [deliveries, setDeliveries] = useState<Delivery[]>(deliveryData as Delivery[]);

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
  const handleDeliveryDelete = (delivery: Delivery) => {
    setDeliveries(prev => prev.filter(d => d.id !== delivery.id));
  };

  // 納品書更新ハンドラー
  const handleDeliveryUpdate = (rowId: string, field: string, value: unknown) => {
    setDeliveries(prev => prev.map(delivery => 
      delivery.id.toString() === rowId 
        ? { ...delivery, [field]: value }
        : delivery
    ));
  };

  return (
    <DocumentLayoutContainer activeType="delivery">
      <div className="h-full flex overflow-hidden">
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
          className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${
            isFilterSidebarOpen ? 'ml-80' : 'ml-0'
          }`}
        >
          <div className="flex-shrink-0 p-4">
            <DocumentHomeDeliveryPageHeader
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              onToggleFilterSidebar={toggleSidebar}
              isFilterSidebarOpen={isFilterSidebarOpen}
              deliveries={filteredDeliveries}
            />
          </div>
          <div className="flex-1 flex flex-col min-h-0 px-4">
            <DocumentHomeDeliveryTableView 
              deliveries={filteredDeliveries}
              onDeliveryDelete={handleDeliveryDelete}
              onDeliveryUpdate={handleDeliveryUpdate}
            />
          </div>
        </div>
      </div>
    </DocumentLayoutContainer>
  );
}