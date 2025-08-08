"use client";
import { useState } from "react";
import projectsData from "../data/project.json";
import { ProjectPageHeader } from "./ProjectPageHeader";
import { ProjectTableView } from "./ProjectTableView";
import { AdvancedFilterSidebar, useAdvancedFilter } from "@/features/advanced-filter";
import { PROJECT_FILTER_CONFIG } from "../lib/projectFilterConfig";
import { PROJECT_SEARCHBAR_CONFIG } from "../lib/projectSearchbarConfig";
import { Project } from "../lib/projectColumns";
import { useSearchbar } from "@/shared/GenericSearch";

export default function ProjectContainer() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // 分離アプローチ: 検索とAdvanced Filterを独立管理
  const {
    searchTerm,
    setSearchTerm,
    filteredData: searchFiltered,
  } = useSearchbar(projectsData as Project[], PROJECT_SEARCHBAR_CONFIG);

  const {
    filteredData: filteredProjects,
    isOpen: isFilterSidebarOpen,
    toggleSidebar,
    filters,
    setFilters,
    clearFilters,
  } = useAdvancedFilter(searchFiltered, PROJECT_FILTER_CONFIG);

  return (
    <div className="h-[calc(100vh-45px)] flex overflow-hidden">
      {/* フィルターサイドバー */}
      <AdvancedFilterSidebar
        isOpen={isFilterSidebarOpen}
        onToggle={toggleSidebar}
        filters={filters}
        onFiltersChange={setFilters}
        onClearFilters={clearFilters}
        config={PROJECT_FILTER_CONFIG}
      />
      
      {/* メインコンテンツ */}
      <div 
        className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${
          isFilterSidebarOpen ? 'ml-80' : 'ml-0'
        }`}
      >
        <div className="flex-shrink-0 p-4">
          <ProjectPageHeader
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onToggleFilterSidebar={toggleSidebar}
            isFilterSidebarOpen={isFilterSidebarOpen}
            projects={filteredProjects}
          />
        </div>
        <div className="flex-1 flex flex-col min-h-0 px-4">
          <ProjectTableView 
            projects={filteredProjects}
            currentPage={currentPage}
            totalItems={filteredProjects.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}