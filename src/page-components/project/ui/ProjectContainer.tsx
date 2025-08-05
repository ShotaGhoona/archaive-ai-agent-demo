"use client";
import { useState } from "react";
import projectsData from "@/page-components/project/data/project.json";
import { ProjectPageHeader } from "./ProjectPageHeader";
import { ProjectTableView } from "./ProjectTableView";
// import { ProjectPagination } from "./ProjectPagination"; // 統合ページネーションのため不要
import { AdvancedFilterSidebar, useAdvancedFilter } from "@/features/advanced-filter";
import { PROJECT_FILTER_CONFIG } from "../lib/projectFilterConfig";
import { Project } from "../lib/projectColumns";

export default function ProjectContainer() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Advanced Filter Hook
  const {
    filteredData: filteredByAdvancedFilter,
    isOpen: isFilterSidebarOpen,
    toggleSidebar,
    filters,
    setFilters,
    clearFilters,
  } = useAdvancedFilter(projectsData as Project[], PROJECT_FILTER_CONFIG);

  // フィルタリングされたデータ
  const filteredProjects = filteredByAdvancedFilter.filter((project) => {
    // 基本検索
    const matchesSearch =
      project.projectId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.assignee.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.projectStatus.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.quotationStatus.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.deliveryStatus.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

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
        {/* ページネーションはBasicDataTable内に統合されるため削除 */}
      </div>
    </div>
  );
}