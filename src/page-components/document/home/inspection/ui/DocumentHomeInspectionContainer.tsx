"use client";
import { useState } from "react";
import { inspectionData } from "../data";
import { DocumentHomeInspectionPageHeader, DocumentHomeInspectionTableView } from "../ui";
import { AdvancedFilterSidebar, useAdvancedFilter, useSearchbar } from "@/shared";
import { INSPECTION_FILTER_CONFIG, INSPECTION_SEARCHBAR_CONFIG } from "../lib";
import { Inspection } from "../model";
import { DocumentLayoutContainer } from "@/widgets";

export function DocumentHomeInspectionContainer() {
  const [inspections, setInspections] = useState<Inspection[]>(inspectionData as Inspection[]);

  // 検索機能
  const {
    searchTerm,
    setSearchTerm,
    filteredData: searchFiltered,
  } = useSearchbar(inspections, INSPECTION_SEARCHBAR_CONFIG);

  // アドバンスドフィルター機能
  const {
    filteredData: filteredInspections,
    isOpen: isFilterSidebarOpen,
    toggleSidebar,
    filters,
    setFilters,
    clearFilters,
  } = useAdvancedFilter(searchFiltered, INSPECTION_FILTER_CONFIG);

  // 検査表削除ハンドラー
  const handleInspectionDelete = (inspection: Inspection) => {
    setInspections(prev => prev.filter(i => i.id !== inspection.id));
  };

  // 検査表更新ハンドラー
  const handleInspectionUpdate = (rowId: string, field: string, value: unknown) => {
    setInspections(prev => prev.map(inspection => 
      inspection.id.toString() === rowId 
        ? { ...inspection, [field]: value }
        : inspection
    ));
  };

  return (
    <DocumentLayoutContainer activeType="inspection">
      <div className="h-full flex overflow-hidden">
        {/* フィルターサイドバー */}
        <AdvancedFilterSidebar
          isOpen={isFilterSidebarOpen}
          onToggle={toggleSidebar}
          filters={filters}
          onFiltersChange={setFilters}
          onClearFilters={clearFilters}
          config={INSPECTION_FILTER_CONFIG}
        />
        
        {/* メインコンテンツ */}
        <div 
          className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${
            isFilterSidebarOpen ? 'ml-80' : 'ml-0'
          }`}
        >
          <div className="flex-shrink-0 p-4">
            <DocumentHomeInspectionPageHeader
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              onToggleFilterSidebar={toggleSidebar}
              isFilterSidebarOpen={isFilterSidebarOpen}
              inspections={filteredInspections}
            />
          </div>
          <div className="flex-1 flex flex-col min-h-0 px-4">
            <DocumentHomeInspectionTableView 
              inspections={filteredInspections}
              onInspectionDelete={handleInspectionDelete}
              onInspectionUpdate={handleInspectionUpdate}
            />
          </div>
        </div>
      </div>
    </DocumentLayoutContainer>
  );
}