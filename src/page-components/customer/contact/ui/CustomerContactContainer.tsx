"use client";
import { useState } from "react";
import contactsData from "../data/contact.json";
import { ContactPageHeader } from "./CustomerContactPageHeader";
import { ContactTableView } from "./CustomerContactTableView";
// import { CustomerPagination } from "./CustomerPagination"; // 統合ページネーションのため不要
import { AdvancedFilterSidebar, useAdvancedFilter } from "@/features/advanced-filter";
import { CONTACT_FILTER_CONFIG } from "../lib/contactFilterConfig";
import { Contact } from "../lib/contactColumns";

interface CustomerContactContainerProps {
  customerId: string;
}

export default function CustomerContactContainer({ customerId }: CustomerContactContainerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [contacts, setContacts] = useState<Contact[]>(contactsData as Contact[]);
  const itemsPerPage = 20;

  // Advanced Filter Hook
  const {
    filteredData: filteredByAdvancedFilter,
    isOpen: isFilterSidebarOpen,
    toggleSidebar,
    filters,
    setFilters,
    clearFilters,
  } = useAdvancedFilter(contacts, CONTACT_FILTER_CONFIG);

  // フィルタリングされたデータ
  const filteredContacts = filteredByAdvancedFilter.filter((contact) => {
    // 基本検索
    const matchesSearch =
      contact.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.contactType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.isActive.toString().toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  // 顧客更新ハンドラー
  const handleContactUpdate = (contactId: string, field: string, value: unknown) => {
    setContacts(prev => prev.map(contact => 
      contact.contactId === contactId 
        ? { ...contact, [field]: value }
        : contact
    ));
  };

  // 新規連絡先作成ハンドラー
  const handleContactCreate = (contactData: Omit<Contact, 'contactId' | 'customerId' | 'createdAt' | 'updatedAt' | 'isActive'>) => {
    const newContactId = `CONT-2024-${String(contacts.length + 1).padStart(3, '0')}`;
    const now = new Date().toISOString();
    const newContact: Contact = {
      contactId: newContactId,
      customerId: customerId,
      isActive: true,
      createdAt: now,
      updatedAt: now,
      ...contactData,
    };
    setContacts(prev => [...prev, newContact]);
  };

  return (
    <div className="h-[calc(100vh-45px)] flex overflow-hidden">
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
        className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${
          isFilterSidebarOpen ? 'ml-80' : 'ml-0'
        }`}
      >
        <div className="flex-shrink-0 p-4">
          <ContactPageHeader
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onToggleFilterSidebar={toggleSidebar}
            isFilterSidebarOpen={isFilterSidebarOpen}
            contacts={filteredContacts}
            onContactCreate={handleContactCreate}
            customerId={customerId}
          />
        </div>
        <div className="flex-1 flex flex-col min-h-0 px-4">
          <ContactTableView 
            contacts={filteredContacts}
            onContactUpdate={handleContactUpdate}
            currentPage={currentPage}
            totalItems={filteredContacts.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}