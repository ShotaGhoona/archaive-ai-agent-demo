import { CUSTOMER_CSV_COLUMNS } from "../lib";
import { Customer } from "../model/type";
import { CreateCustomerDialog } from "../ui";
import { SearchInput, CsvExportDialog, FilterToggleButton } from "@/shared";

interface CustomerPageHeaderProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  onToggleFilterSidebar: () => void;
  isFilterSidebarOpen: boolean;
  customers?: unknown[];
  onCustomerCreate?: (customer: Omit<Customer, 'id' | 'company_id' | 'created_at' | 'updated_at'>) => void;
}

export function CustomerPageHeader({
  searchTerm,
  setSearchTerm,
  onToggleFilterSidebar,
  isFilterSidebarOpen,
  customers = [],
  onCustomerCreate,
}: CustomerPageHeaderProps) {
  const handleCustomerCreate = (customer: Omit<Customer, 'id' | 'company_id' | 'created_at' | 'updated_at'>) => {
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
          placeholder="顧客名で検索"
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