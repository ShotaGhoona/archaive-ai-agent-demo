import {
  Input,
} from "@/shared/shadcnui";
import {
  Search,
} from "lucide-react";
import { FilterToggleButton } from "@/features/advanced-filter";
import { CsvExportDialog } from "@/features/csv-export";
import { CUSTOMER_CSV_COLUMNS } from "../lib/customerCsvConfig";
import { CreateCustomerDialog } from "./CreateCustomerDialog";
import { Customer } from "../lib/customerColumns";

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
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            placeholder="取引先名、コード、担当者、業界で検索"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 w-96 h-10 text-base"
          />
        </div>
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