import React from "react";
import { TableView } from "@/shared";
import { Project, createProjectTableConfig } from "../lib/projectTableConfig";

interface ProjectTableViewProps {
  projects: Project[];
  onProjectUpdate?: (projectId: string, field: string, value: unknown) => void;
}

export function ProjectTableView({ 
  projects, 
  onProjectUpdate
}: ProjectTableViewProps) {
  const config = createProjectTableConfig();

  return (
    <TableView
      data={projects}
      config={config}
      onItemUpdate={onProjectUpdate}
      getRowId={(project) => project.projectId}
    />
  );
}