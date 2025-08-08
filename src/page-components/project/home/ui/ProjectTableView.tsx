import React from "react";
import { BasicDataTable } from "@/shared/basic-data-table";
import { Project, PROJECT_COLUMNS } from "../lib/projectColumns";

interface ProjectTableViewProps {
  projects: Project[];
  onProjectUpdate?: (projectId: string, field: string, value: unknown) => void;
  // ページネーション統合のための新しいprops
  currentPage?: number;
  totalItems?: number;
  itemsPerPage?: number;
  onPageChange?: (page: number) => void;
}

export function ProjectTableView({ 
  projects, 
  onProjectUpdate,
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange
}: ProjectTableViewProps) {
  // ページネーション設定
  const paginationConfig = currentPage && totalItems && itemsPerPage && onPageChange ? {
    enabled: true,
    currentPage,
    itemsPerPage,
    totalItems,
    onPageChange,
    showTotalItems: true,
  } : undefined;

  return (
    <BasicDataTable
      data={projects}
      columns={PROJECT_COLUMNS}
      onItemUpdate={onProjectUpdate}
      getRowId={(project) => project.projectId}
      emptyMessage="プロジェクトデータがありません"
      pagination={paginationConfig}
    />
  );
}