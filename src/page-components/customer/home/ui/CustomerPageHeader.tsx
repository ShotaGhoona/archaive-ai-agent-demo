import { FilterToggleButton } from "@/features/advanced-filter";
import { CsvExportDialog } from "@/features/csv-export";
import { CUSTOMER_CSV_COLUMNS } from "../lib/customerCsvConfig";
import { CreateCustomerDialog } from "./CreateCustomerDialog";
import { Customer } from "../lib/customerColumns";
import { SearchInput } from "@/shared/GenericSearch";

interface CustomerPageHeaderProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  onToggleFilterSidebar: () => void;
  isFilterSidebarOpen: boolean;
  customers?: unknown[];
  onCustomerCreate?: (customer: Omit<Customer, 'customerCode'>) => void;
}

export function CustomerPageHeader({
  searchTerm,
  setSearchTerm,
  onToggleFilterSidebar,
  isFilterSidebarOpen,
  customers = [],
  onCustomerCreate,
}: CustomerPageHeaderProps) {
  const handleCustomerCreate = (customer: Omit<Customer, 'customerCode'>) => {
    onCustomerCreate?.(customer);
  };

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
          placeholder="取引先名、コード、担当者、業界で検索"
        />
      </div>
      <div className="flex items-center gap-3">
        {/* CSV出力ボタン */}
        <CsvExportDialog
          data={customers as Customer[]}
          initialColumns={CUSTOMER_CSV_COLUMNS}
          defaultFilename="customers"
        />
        {/* 新規取引先登録ボタン */}
        <CreateCustomerDialog
          onSubmit={handleCustomerCreate}
        />
      </div>
    </div>
  );
}