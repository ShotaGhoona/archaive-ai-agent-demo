"use client";
import { useState } from "react";
import projectsData from "@/page-components/project/data/project.json";
import { ProjectPageHeader } from "./ProjectPageHeader";
import { ProjectTableView } from "./ProjectTableView";
import { ProjectPagination } from "./ProjectPagination";
import { ProjectFilterSidebar } from "./ProjectFilterSidebar";

export default function ProjectContainer() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);
  const [detailFilters, setDetailFilters] = useState({
    projectId: "",
    customerName: "",
    assignee: "",
    responseDeadlineFrom: "",
    responseDeadlineTo: "",
    workCompleteDateFrom: "",
    workCompleteDateTo: "",
    deliveryDeadlineFrom: "",
    deliveryDeadlineTo: "",
    receiptDateFrom: "",
    receiptDateTo: "",
    projectStatus: "all",
    quotationStatus: "all",
    deliveryStatus: "all",
    lastUpdatedBy: "",
    lastUpdatedAtFrom: "",
    lastUpdatedAtTo: "",
  });
  const itemsPerPage = 20;

  // フィルタリングされたデータ
  const filteredProjects = projectsData.filter((project) => {
    // 基本検索
    const matchesSearch =
      project.projectId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.assignee.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.projectStatus.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.quotationStatus.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.deliveryStatus.toLowerCase().includes(searchTerm.toLowerCase());

    // 詳細フィルター
    const matchesDetailFilters = (
      (!detailFilters.projectId || project.projectId.toLowerCase().includes(detailFilters.projectId.toLowerCase())) &&
      (!detailFilters.customerName || project.customerName.toLowerCase().includes(detailFilters.customerName.toLowerCase())) &&
      (!detailFilters.assignee || project.assignee.toLowerCase().includes(detailFilters.assignee.toLowerCase())) &&
      (!detailFilters.responseDeadlineFrom || project.responseDeadline >= detailFilters.responseDeadlineFrom) &&
      (!detailFilters.responseDeadlineTo || project.responseDeadline <= detailFilters.responseDeadlineTo) &&
      (!detailFilters.workCompleteDateFrom || (project.workCompleteDate && project.workCompleteDate >= detailFilters.workCompleteDateFrom)) &&
      (!detailFilters.workCompleteDateTo || (project.workCompleteDate && project.workCompleteDate <= detailFilters.workCompleteDateTo)) &&
      (!detailFilters.deliveryDeadlineFrom || project.deliveryDeadline >= detailFilters.deliveryDeadlineFrom) &&
      (!detailFilters.deliveryDeadlineTo || project.deliveryDeadline <= detailFilters.deliveryDeadlineTo) &&
      (!detailFilters.receiptDateFrom || (project.receiptDate && project.receiptDate >= detailFilters.receiptDateFrom)) &&
      (!detailFilters.receiptDateTo || (project.receiptDate && project.receiptDate <= detailFilters.receiptDateTo)) &&
      (!detailFilters.projectStatus || detailFilters.projectStatus === "all" || project.projectStatus === detailFilters.projectStatus) &&
      (!detailFilters.quotationStatus || detailFilters.quotationStatus === "all" || project.quotationStatus === detailFilters.quotationStatus) &&
      (!detailFilters.deliveryStatus || detailFilters.deliveryStatus === "all" || project.deliveryStatus === detailFilters.deliveryStatus) &&
      (!detailFilters.lastUpdatedBy || project.lastUpdatedBy.toLowerCase().includes(detailFilters.lastUpdatedBy.toLowerCase())) &&
      (!detailFilters.lastUpdatedAtFrom || project.lastUpdatedAt >= detailFilters.lastUpdatedAtFrom) &&
      (!detailFilters.lastUpdatedAtTo || project.lastUpdatedAt <= detailFilters.lastUpdatedAtTo)
    );

    return matchesSearch && matchesDetailFilters;
  });

  // ページネーション
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProjects = filteredProjects.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const clearDetailFilters = () => {
    setDetailFilters({
      projectId: "",
      customerName: "",
      assignee: "",
      responseDeadlineFrom: "",
      responseDeadlineTo: "",
      workCompleteDateFrom: "",
      workCompleteDateTo: "",
      deliveryDeadlineFrom: "",
      deliveryDeadlineTo: "",
      receiptDateFrom: "",
      receiptDateTo: "",
      projectStatus: "all",
      quotationStatus: "all",
      deliveryStatus: "all",
      lastUpdatedBy: "",
      lastUpdatedAtFrom: "",
      lastUpdatedAtTo: "",
    });
  };

  return (
    <div className="h-[calc(100vh-45px)] flex overflow-hidden">
      {/* フィルターサイドバー */}
      <ProjectFilterSidebar
        isOpen={isFilterSidebarOpen}
        onToggle={() => setIsFilterSidebarOpen(!isFilterSidebarOpen)}
        filters={detailFilters}
        onFiltersChange={setDetailFilters}
        onClearFilters={clearDetailFilters}
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
            onToggleFilterSidebar={() => setIsFilterSidebarOpen(!isFilterSidebarOpen)}
            isFilterSidebarOpen={isFilterSidebarOpen}
            projects={filteredProjects}
          />
        </div>
        <div className="flex-1 flex flex-col min-h-0 px-4">
          <ProjectTableView projects={currentProjects} />
        </div>
        <div className="flex-shrink-0 p-4">
          <ProjectPagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}