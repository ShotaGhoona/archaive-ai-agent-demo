'use client';
// 複数の場所（Project Home、Customer Project等）で再利用するためwidget層に移動
import { useState } from 'react';
import {
  projectHomeData,
  DirectoryBaseDataInterface,
} from '@/dummy-data-er-fix/project';
import {
  ProjectDataViewPageHeader,
  ProjectTableView,
  ProjectKanbanView,
} from '../ui';
import {
  AdvancedFilterSidebar,
  useAdvancedFilter,
  useSearchbar,
} from '@/shared';
import { setValue } from '@/shared';
import { PROJECT_SEARCHBAR_CONFIG, PROJECT_FILTER_CONFIG } from '../lib';

export function ProjectDataViewContainer() {
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table');
  const [projects, setProjects] =
    useState<DirectoryBaseDataInterface[]>(projectHomeData);

  // 分離アプローチ: 検索とAdvanced Filterを独立管理
  const {
    searchTerm,
    setSearchTerm,
    filteredData: searchFiltered,
  } = useSearchbar(projects, PROJECT_SEARCHBAR_CONFIG);

  const {
    filteredData: filteredProjects,
    isOpen: isFilterSidebarOpen,
    toggleSidebar,
    filters,
    setFilters,
    clearFilters,
  } = useAdvancedFilter(searchFiltered, PROJECT_FILTER_CONFIG);

  // プロジェクト更新ハンドラー
  const handleProjectUpdate = (
    rowId: string,
    field: string,
    value: unknown,
  ) => {
    setProjects((prev) =>
      prev.map((project) => {
        if (project.id.toString() === rowId) {
          const updatedProject = { ...project };
          setValue(updatedProject, field, value);
          updatedProject.updated_at = new Date().toISOString();
          return updatedProject;
        }
        return project;
      }),
    );
  };

  return (
    <div className='flex h-[calc(100vh-60px)] overflow-hidden'>
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
        className={`flex flex-1 flex-col overflow-hidden transition-all duration-300 ${
          isFilterSidebarOpen ? 'ml-80' : 'ml-0'
        }`}
      >
        <div className='flex-shrink-0 p-4'>
          <ProjectDataViewPageHeader
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            viewMode={viewMode}
            setViewMode={setViewMode}
            onToggleFilterSidebar={toggleSidebar}
            isFilterSidebarOpen={isFilterSidebarOpen}
            projects={filteredProjects}
          />
        </div>
        <div className='flex min-h-0 flex-1 flex-col px-4'>
          {viewMode === 'table' && (
            <ProjectTableView
              projects={filteredProjects}
              onProjectUpdate={handleProjectUpdate}
            />
          )}
          {viewMode === 'kanban' && (
            <ProjectKanbanView projects={filteredProjects} />
          )}
        </div>
      </div>
    </div>
  );
}
