"use client";
import { useState } from "react";
import blueprintsData from "../data/blueprint.json";
import { BlueprintPageHeader } from "./BlueprintPageHeader";
import { TableView } from "./TableView";
import { GalleryView } from "./GalleryView";
// import { BlueprintPagination } from "./BlueprintPagination"; // 統合ページネーションのため不要
import { AdvancedFilterSidebar, useAdvancedFilter } from "@/features/advanced-filter";
import { BLUEPRINT_FILTER_CONFIG } from "../lib/blueprintFilterConfig";
import { Blueprint } from "../lib/blueprintColumns";



export default function BlueprintContainer() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilter, setSelectedFilter] = useState("全て");
  const [viewMode, setViewMode] = useState<"table" | "gallery">("table");
  const itemsPerPage = 20;

  // Advanced Filter Hook
  const {
    filteredData: filteredByAdvancedFilter,
    isOpen: isFilterSidebarOpen,
    toggleSidebar,
    filters,
    setFilters,
    clearFilters,
  } = useAdvancedFilter(blueprintsData as Blueprint[], BLUEPRINT_FILTER_CONFIG);

  // フィルタリングされたデータ
  const filteredBlueprints = filteredByAdvancedFilter.filter((blueprint) => {
    // 基本検索
    const matchesSearch =
      blueprint.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blueprint.orderSource.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blueprint.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blueprint.internalNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blueprint.customerNumber.toLowerCase().includes(searchTerm.toLowerCase());

    // 基本フィルター
    const matchesFilter =
      selectedFilter === "全て" || blueprint.companyField === selectedFilter;

    return matchesSearch && matchesFilter;
  });

  // ページネーション（統合ページネーションでは手動スライシング不要）


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
        {/* ページネーションはBasicDataTable内に統合されるため削除 */}
      </div>
    </div>
  );
}