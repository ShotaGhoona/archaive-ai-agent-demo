import { ORDER_CSV_COLUMNS } from "../lib";
import { Order } from "../model";
import { SearchInput, CsvExportDialog, FilterToggleButton } from "@/shared";

interface OrderPageHeaderProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  onToggleFilterSidebar: () => void;
  isFilterSidebarOpen: boolean;
  orders?: Order[];
}

export function DocumentHomeOrderPageHeader({
  searchTerm,
  setSearchTerm,
  onToggleFilterSidebar,
  isFilterSidebarOpen,
  orders = [],
}: OrderPageHeaderProps) {
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
          placeholder="発注書名・案件名・発注先で検索"
        />
      </div>
      <div className="flex items-center gap-3">
        {/* CSV出力ボタン */}
        <CsvExportDialog
          data={orders}
          initialColumns={ORDER_CSV_COLUMNS}
          defaultFilename="orders"
        />
      </div>
    </div>
  );
}