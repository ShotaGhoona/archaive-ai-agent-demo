import { QUOTATION_CSV_COLUMNS } from "../lib";
import { Quotation } from "../model";
import { SearchInput, CsvExportDialog, FilterToggleButton } from "@/shared";

interface QuotationPageHeaderProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  onToggleFilterSidebar: () => void;
  isFilterSidebarOpen: boolean;
  quotations?: Quotation[];
}

export function DocumentHomeQuotationPageHeader({
  searchTerm,
  setSearchTerm,
  onToggleFilterSidebar,
  isFilterSidebarOpen,
  quotations = [],
}: QuotationPageHeaderProps) {
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
          placeholder="見積書名・案件名・顧客名で検索"
        />
      </div>
      <div className="flex items-center gap-3">
        {/* CSV出力ボタン */}
        <CsvExportDialog
          data={quotations}
          initialColumns={QUOTATION_CSV_COLUMNS}
          defaultFilename="quotations"
        />
      </div>
    </div>
  );
}