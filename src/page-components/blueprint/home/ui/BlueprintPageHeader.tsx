import {
  Button,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  SearchInput,
  CsvExportDialog,
  FilterToggleButton,
} from '@/shared';
import { Grid3X3, List } from 'lucide-react';
import { SimilarBlueprintSearchDialog } from '../ui';
import { BLUEPRINT_CSV_COLUMNS } from '../lib';
import { DrawingPageBaseDataInterface } from '@/dummy-data-er-fix/blueprint';

interface BlueprintPageHeaderProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedFilter: string;
  setSelectedFilter: (value: string) => void;
  viewMode: 'table' | 'gallery';
  setViewMode: (mode: 'table' | 'gallery') => void;
  onToggleFilterSidebar: () => void;
  isFilterSidebarOpen: boolean;
  blueprints?: unknown[];
}

export function BlueprintPageHeader({
  searchTerm,
  setSearchTerm,
  viewMode,
  setViewMode,
  onToggleFilterSidebar,
  isFilterSidebarOpen,
  blueprints = [],
}: BlueprintPageHeaderProps) {
  return (
    <div className='flex items-center justify-between'>
      <div className='flex items-center gap-4'>
        <div className='bg-background flex items-center gap-1 rounded-lg border border-gray-200'>
          <Tooltip delayDuration={500}>
            <TooltipTrigger asChild>
              <Button
                variant={viewMode === 'table' ? 'default' : 'ghost'}
                size='lg'
                onClick={() => setViewMode('table')}
                className='h-10 w-10 p-0'
              >
                <List className='h-5 w-5' />
              </Button>
            </TooltipTrigger>
            <TooltipContent side='bottom'>テーブルビュー</TooltipContent>
          </Tooltip>
          <Tooltip delayDuration={500}>
            <TooltipTrigger asChild>
              <Button
                variant={viewMode === 'gallery' ? 'default' : 'ghost'}
                size='lg'
                onClick={() => setViewMode('gallery')}
                className='h-10 w-10 p-0'
              >
                <Grid3X3 className='h-5 w-5' />
              </Button>
            </TooltipTrigger>
            <TooltipContent side='bottom'>ギャラリービュー</TooltipContent>
          </Tooltip>
        </div>
        <FilterToggleButton
          isOpen={isFilterSidebarOpen}
          onToggle={onToggleFilterSidebar}
        />
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder='ファイル名、顧客名、製品名、図面番号で検索'
        />
      </div>
      <div className='flex items-center gap-4'>
        {/* CSV出力ボタン */}
        <CsvExportDialog
          data={blueprints as DrawingPageBaseDataInterface[]}
          initialColumns={BLUEPRINT_CSV_COLUMNS}
          defaultFilename='blueprints'
        />
        {/* 類似図面検索 */}
        <SimilarBlueprintSearchDialog />
      </div>
    </div>
  );
}
