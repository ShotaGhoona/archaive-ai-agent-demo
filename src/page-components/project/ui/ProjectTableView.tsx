import React from "react";
import { BasicDataTable } from "@/shared/basic-data-table";
import { Project, PROJECT_COLUMNS } from "../lib/projectColumns";

interface ProjectTableViewProps {
  projects: Project[];
  onProjectUpdate?: (projectId: string, field: string, value: any) => void;
}

export function ProjectTableView({ projects, onProjectUpdate }: ProjectTableViewProps) {
  return (
    <BasicDataTable
      data={projects}
      columns={PROJECT_COLUMNS}
      onItemUpdate={onProjectUpdate}
      getRowId={(project) => project.projectId}
      emptyMessage="プロジェクトデータがありません"
    />
  );
}