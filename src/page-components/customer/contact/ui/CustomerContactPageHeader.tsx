import { FilterToggleButton } from "@/features/advanced-filter";
import { CsvExportDialog } from "@/features/csv-export";
import { CONTACT_CSV_COLUMNS } from "../lib/contactCsvConfig";
import { CreateContactDialog } from "./CreateContactDialog";
import { Contact } from "../lib/contactColumns";
import { SearchInput } from "@/shared/GenericSearch";

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
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="連絡先名、部門、メール、電話番号で検索"
        />
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