import {
  Input,
} from "@/shared/shadcnui";
import {
  Search,
} from "lucide-react";
import { FilterToggleButton } from "@/features/advanced-filter";
import { CsvExportDialog } from "@/features/csv-export";
import { CONTACT_CSV_COLUMNS } from "../lib/contactCsvConfig";
import { CreateContactDialog } from "./CreateContactDialog";
import { Contact } from "../lib/contactColumns";

interface ContactPageHeaderProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  onToggleFilterSidebar: () => void;
  isFilterSidebarOpen: boolean;
  contacts?: unknown[];
  customerId: string;
  onContactCreate?: (contact: Omit<Contact, 'contactId' | 'customerId' | 'createdAt' | 'updatedAt' | 'isActive'>) => void;
}

export function ContactPageHeader({
  searchTerm,
  setSearchTerm,
  onToggleFilterSidebar,
  isFilterSidebarOpen,
  contacts = [],
  customerId,
  onContactCreate,
}: ContactPageHeaderProps) {
  const handleContactCreate = (contact: Omit<Contact, 'contactId' | 'customerId' | 'createdAt' | 'updatedAt' | 'isActive'>) => {
    onContactCreate?.(contact);
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
            placeholder="連絡先名、部門、メール、電話番号で検索"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 w-96 h-10 text-base"
          />
        </div>
      </div>
      <div className="flex items-center gap-3">
        {/* CSV出力ボタン */}
        <CsvExportDialog
          data={contacts as Contact[]}
          initialColumns={CONTACT_CSV_COLUMNS}
          defaultFilename="contacts"
        />
        {/* 新規連絡先登録ボタン */}
        <CreateContactDialog
          customerId={customerId}
          onSubmit={handleContactCreate}
        />
      </div>
    </div>
  );
}