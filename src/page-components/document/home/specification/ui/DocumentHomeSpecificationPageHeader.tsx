'use client';
import React from 'react';
import { SearchInput, CsvExportDialog, FilterToggleButton } from '@/shared';
import { DocumentSpecificationDataInterface } from '@/dummy-data-er-fix/document';
import { SPECIFICATION_CSV_COLUMNS } from '../lib';

interface DocumentHomeSpecificationPageHeaderProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  onToggleFilterSidebar: () => void;
  isFilterSidebarOpen: boolean;
  specifications?: DocumentSpecificationDataInterface[];
}

export function DocumentHomeSpecificationPageHeader({
  searchTerm,
  setSearchTerm,
  onToggleFilterSidebar,
  isFilterSidebarOpen,
  specifications = [],
}: DocumentHomeSpecificationPageHeaderProps) {
  return (
    <div className='flex items-center justify-between gap-4'>
      <div className='flex items-center gap-4'>
        <FilterToggleButton
          isOpen={isFilterSidebarOpen}
          onToggle={onToggleFilterSidebar}
        />
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder='仕様書名・プロジェクト名・図面名で検索'
        />
      </div>
      <div className='flex items-center gap-2'>
        <CsvExportDialog
          data={specifications}
          initialColumns={SPECIFICATION_CSV_COLUMNS}
          defaultFilename='specifications'
        />
      </div>
    </div>
  );
}
