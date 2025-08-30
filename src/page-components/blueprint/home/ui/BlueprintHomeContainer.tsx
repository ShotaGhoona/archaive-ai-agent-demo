"use client";
import { useState } from "react";
import { BlueprintPageHeader, BlueprintTableView, BlueprintGalleryView } from "../ui";
import { AdvancedFilterSidebar, useAdvancedFilter, useSearchbar } from "@/shared";
import { BlueprintHomeDataInterface, blueprintHomeData } from "@/dummy-data/blueprint";
import { BLUEPRINT_FILTER_CONFIG, BLUEPRINT_SEARCHBAR_CONFIG } from "../lib";

export function BlueprintHomeContainer() {
  const [viewMode, setViewMode] = useState<"table" | "gallery">("table");
  const [blueprints, setBlueprints] = useState<BlueprintHomeDataInterface[]>(blueprintHomeData as BlueprintHomeDataInterface[]);

  // 分離アプローチ: 検索とAdvanced Filterを独立管理
  const {
    searchTerm,
    setSearchTerm,
    selectedFilter,
    setSelectedFilter,
    filteredData: searchFiltered,
  } = useSearchbar(blueprints, BLUEPRINT_SEARCHBAR_CONFIG);

  const {
    filteredData: filteredBlueprints,
    isOpen: isFilterSidebarOpen,
    toggleSidebar,
    filters,
    setFilters,
    clearFilters,
  } = useAdvancedFilter(searchFiltered, BLUEPRINT_FILTER_CONFIG);

  // 図面更新ハンドラー
  const handleBlueprintUpdate = (internalNumber: string, field: string, value: unknown) => {
    setBlueprints(prev => prev.map(blueprint => 
      blueprint.internalNumber === internalNumber 
        ? { ...blueprint, [field]: value }
        : blueprint
    ));
  };

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
              onBlueprintUpdate={handleBlueprintUpdate}
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