import { CONTACT_CSV_COLUMNS } from '../lib';
import { CustomerContactDataInterface } from '@/dummy-data-er-fix/customer';
import { CreateContactDialog } from '../ui';
import { SearchInput, CsvExportDialog, FilterToggleButton } from '@/shared';

interface CustomerContactPageHeaderProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  onToggleFilterSidebar: () => void;
  isFilterSidebarOpen: boolean;
  contacts?: unknown[];
  customerId: string;
  onContactCreate?: (
    contact: Omit<
      CustomerContactDataInterface,
      | 'id'
      | 'customer_id'
      | 'created_at'
      | 'updated_at'
    >,
  ) => void;
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
  const handleContactCreate = (
    contact: Omit<
      CustomerContactDataInterface,
      | 'id'
      | 'customer_id'
      | 'created_at'
      | 'updated_at'
    >,
  ) => {
    onContactCreate?.(contact);
  };

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
          placeholder='姓、名、メールアドレス、役職、部署で検索'
        />
      </div>
      <div className='flex items-center gap-3'>
        {/* CSV出力ボタン */}
        <CsvExportDialog
          data={contacts as CustomerContactDataInterface[]}
          initialColumns={CONTACT_CSV_COLUMNS}
          defaultFilename='contacts'
        />
        {/* 新規担当者登録ボタン */}
        <CreateContactDialog
          customerId={Number(customerId)}
          onSubmit={handleContactCreate}
        />
      </div>
    </div>
  );
}
