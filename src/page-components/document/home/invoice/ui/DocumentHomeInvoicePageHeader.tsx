import { INVOICE_CSV_COLUMNS } from "../lib";
import { Invoice } from "../model";
import { SearchInput, CsvExportDialog, FilterToggleButton } from "@/shared";

interface InvoicePageHeaderProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  onToggleFilterSidebar: () => void;
  isFilterSidebarOpen: boolean;
  invoices?: Invoice[];
}

export function DocumentHomeInvoicePageHeader({
  searchTerm,
  setSearchTerm,
  onToggleFilterSidebar,
  isFilterSidebarOpen,
  invoices = [],
}: InvoicePageHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <FilterToggleButton
          isOpen={isFilterSidebarOpen}
          onToggle={onToggleFilterSidebar}
        />
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="請求書名・プロジェクト名・請求先で検索"
        />
      </div>
      <div className="flex items-center gap-3">
        <CsvExportDialog
          data={invoices}
          initialColumns={INVOICE_CSV_COLUMNS}
          defaultFilename="invoices"
        />
      </div>
    </div>
  );
}