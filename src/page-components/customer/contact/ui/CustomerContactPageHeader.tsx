import { FilterToggleButton, CsvExportDialog } from "@/features";
import { CONTACT_CSV_COLUMNS, Contact } from "../lib";
import { CreateContactDialog } from "../ui";
import { SearchInput } from "@/shared";

interface CustomerContactPageHeaderProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  onToggleFilterSidebar: () => void;
  isFilterSidebarOpen: boolean;
  contacts?: unknown[];
  customerId: string;
  onContactCreate?: (contact: Omit<Contact, 'contactId' | 'customerId' | 'createdAt' | 'updatedAt' | 'isActive'>) => void;
}

export function CustomerContactPageHeader({
  searchTerm,
  setSearchTerm,
  onToggleFilterSidebar,
  isFilterSidebarOpen,
  contacts = [],
  customerId,
  onContactCreate,
}: CustomerContactPageHeaderProps) {
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