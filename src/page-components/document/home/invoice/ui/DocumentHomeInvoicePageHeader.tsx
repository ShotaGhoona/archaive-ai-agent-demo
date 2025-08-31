import { INVOICE_CSV_COLUMNS } from '../lib';
import { DocumentInvoiceDataInterface } from '@/dummy-data-er-fix/document';
import { SearchInput, CsvExportDialog, FilterToggleButton } from '@/shared';

interface InvoicePageHeaderProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  onToggleFilterSidebar: () => void;
  isFilterSidebarOpen: boolean;
  invoices?: DocumentInvoiceDataInterface[];
}

export function DocumentHomeInvoicePageHeader({
  searchTerm,
  setSearchTerm,
  onToggleFilterSidebar,
  isFilterSidebarOpen,
  invoices = [],
}: InvoicePageHeaderProps) {
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
          placeholder='プロジェクトID・備考で検索'
        />
      </div>
      <div className='flex items-center gap-3'>
        <CsvExportDialog
          data={invoices}
          initialColumns={INVOICE_CSV_COLUMNS}
          defaultFilename='invoices'
        />
      </div>
    </div>
  );
}
