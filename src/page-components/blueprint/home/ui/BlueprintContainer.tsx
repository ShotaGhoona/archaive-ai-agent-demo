"use client";
import { useState } from "react";
import blueprintsData from "../data/blueprint.json";
import { BlueprintPageHeader } from "./BlueprintPageHeader";
import { TableView } from "./TableView";
import { GalleryView } from "./GalleryView";
import { AdvancedFilterSidebar, useAdvancedFilter } from "@/features/advanced-filter";
import { BLUEPRINT_FILTER_CONFIG } from "../lib/blueprintFilterConfig";
import { BLUEPRINT_SEARCHBAR_CONFIG } from "../lib/blueprintSearchbarConfig";
import { Blueprint } from "../lib/blueprintColumns";
import { useSearchbar } from "@/shared/GenericSearch";

export default function BlueprintContainer() {
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<"table" | "gallery">("table");
  const itemsPerPage = 20;

  // 分離アプローチ: 検索とAdvanced Filterを独立管理
  const {
    searchTerm,
    setSearchTerm,
    selectedFilter,
    setSelectedFilter,
    filteredData: searchFiltered,
  } = useSearchbar(blueprintsData as Blueprint[], BLUEPRINT_SEARCHBAR_CONFIG);

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
            <TableView 
              blueprints={filteredBlueprints}
              currentPage={currentPage}
              totalItems={filteredBlueprints.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
            />
          )}
          {viewMode === "gallery" && (
            <GalleryView 
              blueprints={filteredBlueprints.slice(
                (currentPage - 1) * itemsPerPage,
                currentPage * itemsPerPage
              )} 
            />
          )}
        </div>
      </div>
    </div>
  );
}