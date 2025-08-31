import React from 'react';
import { TableView } from '@/shared';
import { DirectoryBaseDataInterface } from '@/dummy-data-er-fix/project';
import { createProjectTableConfig } from '../lib/projectTableConfig';

interface ProjectTableViewProps {
  projects: DirectoryBaseDataInterface[];
  onProjectUpdate?: (rowId: string, field: string, value: unknown) => void;
}

export function ProjectTableView({
  projects,
  onProjectUpdate,
}: ProjectTableViewProps) {
  const config = createProjectTableConfig();

  return (
    <TableView
      data={projects}
      config={config}
      onItemUpdate={onProjectUpdate}
      getRowId={(project) => project.id.toString()}
    />
  );
}
