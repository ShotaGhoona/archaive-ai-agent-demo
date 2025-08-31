import { DELIVERY_CSV_COLUMNS } from '../lib';
import { DocumentDeliveryDataInterface } from '@/dummy-data-er-fix/document';
import { SearchInput, CsvExportDialog, FilterToggleButton } from '@/shared';

interface DeliveryPageHeaderProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  onToggleFilterSidebar: () => void;
  isFilterSidebarOpen: boolean;
  deliveries?: DocumentDeliveryDataInterface[];
}

export function DocumentHomeDeliveryPageHeader({
  searchTerm,
  setSearchTerm,
  onToggleFilterSidebar,
  isFilterSidebarOpen,
  deliveries = [],
}: DeliveryPageHeaderProps) {
  return (
    <div className='flex items-center justify-between'>
      <div className='flex items-center gap-4'>
        <FilterToggleButton
          isOpen={isFilterSidebarOpen}
          onToggle={onToggleFilterSidebar}
        />
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder='納品書番号・プロジェクト名・納品先で検索'
        />
      </div>
      <div className='flex items-center gap-3'>
        <CsvExportDialog
          data={deliveries}
          initialColumns={DELIVERY_CSV_COLUMNS}
          defaultFilename='deliveries'
        />
      </div>
    </div>
  );
}
