"use client";
import { useState } from "react";
import { DocumentTypeHeader } from "./DocumentTypeHeader";
import { DocumentPageHeader } from "./DocumentPageHeader";
import { DocumentTableView } from "./DocumentTableView";
import { AdvancedFilterSidebar, useAdvancedFilter } from "@/features";
import { useSearchbar } from "@/shared";
import { FilterConfig } from "@/features";
import { DocumentData, DocumentType } from "../model";
import { 
  QUOTATION_SEARCHBAR_CONFIG,
  ORDER_SEARCHBAR_CONFIG,
  DELIVERY_SEARCHBAR_CONFIG,
  INVOICE_SEARCHBAR_CONFIG,
  SPECIFICATION_SEARCHBAR_CONFIG,
  INSPECTION_SEARCHBAR_CONFIG,
} from "../lib";
import {
  quotationData,
  orderData,
  deliveryData,
  invoiceData,
  specificationData,
  inspectionData,
} from "../data";
import {
  QUOTATION_FILTER_CONFIG,
  ORDER_FILTER_CONFIG,
  DELIVERY_FILTER_CONFIG,
  INVOICE_FILTER_CONFIG,
  SPECIFICATION_FILTER_CONFIG,
  INSPECTION_FILTER_CONFIG,
} from "../lib";

export function DocumentHomeContainer() {
  const [selectedType, setSelectedType] = useState<DocumentType>("quotation");

  // 選択された帳票種別に応じてデータを取得
  const getCurrentData = () => {
    switch (selectedType) {
      case 'quotation': return quotationData;
      case 'order': return orderData;
      case 'delivery': return deliveryData;
      case 'invoice': return invoiceData;
      case 'specification': return specificationData;
      case 'inspection': return inspectionData;
      default: return quotationData;
    }
  };

  const getCurrentFilterConfig = () => {
    switch (selectedType) {
      case 'quotation': return QUOTATION_FILTER_CONFIG;
      case 'order': return ORDER_FILTER_CONFIG;
      case 'delivery': return DELIVERY_FILTER_CONFIG;
      case 'invoice': return INVOICE_FILTER_CONFIG;
      case 'specification': return SPECIFICATION_FILTER_CONFIG;
      case 'inspection': return INSPECTION_FILTER_CONFIG;
      default: return QUOTATION_FILTER_CONFIG;
    }
  };

  const getCurrentSearchbarConfig = () => {
    switch (selectedType) {
      case 'quotation': return QUOTATION_SEARCHBAR_CONFIG;
      case 'order': return ORDER_SEARCHBAR_CONFIG;
      case 'delivery': return DELIVERY_SEARCHBAR_CONFIG;
      case 'invoice': return INVOICE_SEARCHBAR_CONFIG;
      case 'specification': return SPECIFICATION_SEARCHBAR_CONFIG;
      case 'inspection': return INSPECTION_SEARCHBAR_CONFIG;
      default: return QUOTATION_SEARCHBAR_CONFIG;
    }
  };

  const currentData = getCurrentData();
  const currentFilterConfig = getCurrentFilterConfig();
  const currentSearchbarConfig = getCurrentSearchbarConfig();

  // 検索機能
  const {
    searchTerm,
    setSearchTerm,
    filteredData: searchFiltered,
  } = useSearchbar(currentData as DocumentData[], currentSearchbarConfig as any);

  // アドバンスドフィルター機能
  const {
    filteredData: filteredDocuments,
    isOpen: isFilterSidebarOpen,
    toggleSidebar,
    filters,
    setFilters,
    clearFilters,
  } = useAdvancedFilter(searchFiltered, currentFilterConfig as FilterConfig<DocumentData>[]);

  return (
    <div className="h-[calc(100vh-45px)] flex overflow-hidden">
      {/* フィルターサイドバー */}
      <AdvancedFilterSidebar
        isOpen={isFilterSidebarOpen}
        onToggle={toggleSidebar}
        filters={filters}
        onFiltersChange={setFilters}
        onClearFilters={clearFilters}
        config={currentFilterConfig as FilterConfig<DocumentData>[]}
      />
      
      {/* メインコンテンツ */}
      <div 
        className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${
          isFilterSidebarOpen ? 'ml-80' : 'ml-0'
        }`}
      >
        {/* タブ選択ヘッダー */}
        <div className="flex-shrink-0">
          <DocumentTypeHeader
            selectedType={selectedType}
            onTypeChange={setSelectedType}
          />
        </div>

        {/* 検索・フィルター・CSVヘッダー */}
        <div className="flex-shrink-0 p-4">
          <DocumentPageHeader
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onToggleFilterSidebar={toggleSidebar}
            isFilterSidebarOpen={isFilterSidebarOpen}
            documents={filteredDocuments}
            selectedType={selectedType}
          />
        </div>

        {/* テーブル */}
        <div className="flex-1 flex flex-col min-h-0 px-4">
          <DocumentTableView 
            documents={filteredDocuments}
            selectedType={selectedType}
          />
        </div>
      </div>
    </div>
  );
}