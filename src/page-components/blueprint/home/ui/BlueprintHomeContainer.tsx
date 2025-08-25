"use client";
import { useState } from "react";
import { blueprintData } from "../data";
import { BlueprintPageHeader, BlueprintTableView, BlueprintGalleryView } from "../ui";
import { useSearchbar } from "@/shared";
import { AdvancedFilterSidebar, useAdvancedFilter } from "@/features";
import { BLUEPRINT_FILTER_CONFIG, BLUEPRINT_SEARCHBAR_CONFIG, Blueprint } from "../lib";

export function BlueprintHomeContainer() {
  const [viewMode, setViewMode] = useState<"table" | "gallery">("table");

  // 分離アプローチ: 検索とAdvanced Filterを独立管理
  const {
    searchTerm,
    setSearchTerm,
    selectedFilter,
    setSelectedFilter,
    filteredData: searchFiltered,
  } = useSearchbar(blueprintData as Blueprint[], BLUEPRINT_SEARCHBAR_CONFIG);

  const {
    filteredData: filteredBlueprints,
    isOpen: isFilterSidebarOpen,
    toggleSidebar,
    filters,
    setFilters,
    clearFilters,
  } = useAdvancedFilter(searchFiltered, BLUEPRINT_FILTER_CONFIG);

  return (
    <div className="h-[calc(100vh-45px)] flex overflow-hidden">
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
        className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${
          isFilterSidebarOpen ? 'ml-80' : 'ml-0'
        }`}
      >
        <div className="flex-shrink-0 p-4">
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
        <div className="flex-1 flex flex-col min-h-0 px-4">
          {viewMode === "table" && (
            <BlueprintTableView 
              blueprints={filteredBlueprints}
            />
          )}
          {viewMode === "gallery" && (
            <BlueprintGalleryView 
              blueprints={filteredBlueprints} 
            />
          )}
        </div>
      </div>
    </div>
  );
}