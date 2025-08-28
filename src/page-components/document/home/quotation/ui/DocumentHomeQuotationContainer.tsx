"use client";
import { useState } from "react";
import { quotationData } from "../data";
import { DocumentHomeQuotationPageHeader, DocumentHomeQuotationTableView } from "../ui";
import { AdvancedFilterSidebar, useAdvancedFilter, useSearchbar } from "@/shared";
import { QUOTATION_FILTER_CONFIG, QUOTATION_SEARCHBAR_CONFIG } from "../lib";
import { Quotation } from "../model";
import { DocumentLayoutContainer } from "@/widgets";

export function DocumentHomeQuotationContainer() {
  const [quotations, setQuotations] = useState<Quotation[]>(quotationData as Quotation[]);

  // 検索機能
  const {
    searchTerm,
    setSearchTerm,
    filteredData: searchFiltered,
  } = useSearchbar(quotations, QUOTATION_SEARCHBAR_CONFIG);

  // アドバンスドフィルター機能
  const {
    filteredData: filteredQuotations,
    isOpen: isFilterSidebarOpen,
    toggleSidebar,
    filters,
    setFilters,
    clearFilters,
  } = useAdvancedFilter(searchFiltered, QUOTATION_FILTER_CONFIG);

  // 見積書削除ハンドラー
  const handleQuotationDelete = (quotation: Quotation) => {
    setQuotations(prev => prev.filter(q => q.id !== quotation.id));
  };

  // 見積書更新ハンドラー
  const handleQuotationUpdate = (rowId: string, field: string, value: unknown) => {
    setQuotations(prev => prev.map(quotation => 
      quotation.id.toString() === rowId 
        ? { ...quotation, [field]: value }
        : quotation
    ));
  };

  return (
    <DocumentLayoutContainer activeType="quotation">
      <div className="h-full flex overflow-hidden">
        {/* フィルターサイドバー */}
        <AdvancedFilterSidebar
          isOpen={isFilterSidebarOpen}
          onToggle={toggleSidebar}
          filters={filters}
          onFiltersChange={setFilters}
          onClearFilters={clearFilters}
          config={QUOTATION_FILTER_CONFIG}
        />
        
        {/* メインコンテンツ */}
        <div 
          className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${
            isFilterSidebarOpen ? 'ml-80' : 'ml-0'
          }`}
        >
          <div className="flex-shrink-0 p-4">
            <DocumentHomeQuotationPageHeader
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              onToggleFilterSidebar={toggleSidebar}
              isFilterSidebarOpen={isFilterSidebarOpen}
              quotations={filteredQuotations}
            />
          </div>
          <div className="flex-1 flex flex-col min-h-0 px-4">
            <DocumentHomeQuotationTableView 
              quotations={filteredQuotations}
              onQuotationDelete={handleQuotationDelete}
              onQuotationUpdate={handleQuotationUpdate}
            />
          </div>
        </div>
      </div>
    </DocumentLayoutContainer>
  );
}