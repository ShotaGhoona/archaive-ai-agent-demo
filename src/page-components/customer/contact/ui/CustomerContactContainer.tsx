'use client';
import { useState } from 'react';
import { CustomerContactPageHeader, CustomerContactTableView } from '../ui';
import {
  AdvancedFilterSidebar,
  useAdvancedFilter,
  useSearchbar,
  setValue,
} from '@/shared';
import { CONTACT_FILTER_CONFIG, CONTACT_SEARCHBAR_CONFIG } from '../lib';
import {
  CustomerContactDataInterface,
  customerContactData,
} from '@/dummy-data-er-fix/customer';

interface CustomerContactContainerProps {
  customerId: string;
}

export function CustomerContactContainer({
  customerId,
}: CustomerContactContainerProps) {
  const [contacts, setContacts] = useState<CustomerContactDataInterface[]>(
    customerContactData as CustomerContactDataInterface[],
  );

  // 分離アプローチ: 検索とAdvanced Filterを独立管理
  const {
    searchTerm,
    setSearchTerm,
    filteredData: searchFiltered,
  } = useSearchbar(contacts, CONTACT_SEARCHBAR_CONFIG);

  const {
    filteredData: filteredContacts,
    isOpen: isFilterSidebarOpen,
    toggleSidebar,
    filters,
    setFilters,
    clearFilters,
  } = useAdvancedFilter(searchFiltered, CONTACT_FILTER_CONFIG);

  // 新規担当者作成ハンドラー
  const handleContactCreate = (
    contactData: Omit<
      CustomerContactDataInterface,
      | 'id'
      | 'customer_id'
      | 'created_at'
      | 'updated_at'
    >,
  ) => {
    const newId = Math.max(...contacts.map((c) => c.id), 0) + 1;
    const now = new Date().toISOString();
    const newContact: CustomerContactDataInterface = {
      id: newId,
      customer_id: Number(customerId),
      created_at: now,
      updated_at: now,
      ...contactData,
    };
    setContacts((prev) => [...prev, newContact]);
  };

  const handleContactDelete = (contact: CustomerContactDataInterface) => {
    setContacts((prev) =>
      prev.filter((c) => c.id !== contact.id),
    );
  };

  // 担当者更新ハンドラー
  const handleContactUpdate = (
    rowId: string,
    field: string,
    value: unknown,
  ) => {
    setContacts((prev) =>
      prev.map((contact) => {
        if (contact.id.toString() === rowId) {
          const updatedContact = { ...contact };
          setValue(updatedContact, field, value);
          updatedContact.updated_at = new Date().toISOString();
          return updatedContact;
        }
        return contact;
      }),
    );
  };

  return (
    <div className='flex h-[calc(100vh-45px)] overflow-hidden'>
      {/* フィルターサイドバー */}
      <AdvancedFilterSidebar
        isOpen={isFilterSidebarOpen}
        onToggle={toggleSidebar}
        filters={filters}
        onFiltersChange={setFilters}
        onClearFilters={clearFilters}
        config={CONTACT_FILTER_CONFIG}
      />

      {/* メインコンテンツ */}
      <div
        className={`flex flex-1 flex-col overflow-hidden transition-all duration-300 ${
          isFilterSidebarOpen ? 'ml-80' : 'ml-0'
        }`}
      >
        <div className='flex-shrink-0 p-4'>
          <CustomerContactPageHeader
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onToggleFilterSidebar={toggleSidebar}
            isFilterSidebarOpen={isFilterSidebarOpen}
            contacts={filteredContacts}
            onContactCreate={handleContactCreate}
            customerId={customerId}
          />
        </div>
        <div className='flex min-h-0 flex-1 flex-col px-4'>
          <CustomerContactTableView
            contacts={filteredContacts}
            onContactDelete={handleContactDelete}
            onContactUpdate={handleContactUpdate}
          />
        </div>
      </div>
    </div>
  );
}
