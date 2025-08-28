"use client";
import { useState } from "react";
import { specificationData } from "../data";
import { DocumentHomeSpecificationPageHeader, DocumentHomeSpecificationTableView } from "../ui";
import { AdvancedFilterSidebar, useAdvancedFilter, useSearchbar } from "@/shared";
import { SPECIFICATION_FILTER_CONFIG, SPECIFICATION_SEARCHBAR_CONFIG } from "../lib";
import { Specification } from "../model";

export function DocumentHomeSpecificationContainer() {
  const [specifications, setSpecifications] = useState<Specification[]>(specificationData as Specification[]);

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
  const handleSpecificationDelete = (specification: Specification) => {
    setSpecifications(prev => prev.filter(s => s.id !== specification.id));
  };

  // 仕様書更新ハンドラー
  const handleSpecificationUpdate = (rowId: string, field: string, value: unknown) => {
    setSpecifications(prev => prev.map(specification => 
      specification.id.toString() === rowId 
        ? { ...specification, [field]: value }
        : specification
    ));
  };

  return (
    <div className="h-full flex overflow-hidden">
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
        className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${
          isFilterSidebarOpen ? 'ml-80' : 'ml-0'
        }`}
      >
        <div className="flex-shrink-0 p-4">
          <DocumentHomeSpecificationPageHeader
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onToggleFilterSidebar={toggleSidebar}
            isFilterSidebarOpen={isFilterSidebarOpen}
            specifications={filteredSpecifications}
          />
        </div>
        <div className="flex-1 flex flex-col min-h-0 px-4">
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