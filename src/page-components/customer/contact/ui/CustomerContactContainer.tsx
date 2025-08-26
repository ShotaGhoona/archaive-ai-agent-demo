"use client";
import { useState } from "react";
import contactsData from "../data/contact.json";
import { CustomerContactPageHeader, CustomerContactTableView } from "../ui";
import { AdvancedFilterSidebar, useAdvancedFilter, useSearchbar } from "@/shared";
import { CONTACT_FILTER_CONFIG, CONTACT_SEARCHBAR_CONFIG, Contact } from "../lib";

interface CustomerContactContainerProps {
  customerId: string;
}

export function CustomerContactContainer({ customerId }: CustomerContactContainerProps) {
  const [contacts, setContacts] = useState<Contact[]>(contactsData as Contact[]);

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
  const handleContactCreate = (contactData: Omit<Contact, 'id' | 'customer_id' | 'created_at' | 'updated_at'>) => {
    const now = new Date().toISOString();
    const newContact: Contact = {
      id: contacts.length + 1,
      customer_id: Number(customerId),
      created_at: now,
      updated_at: now,
      ...contactData,
    };
    setContacts(prev => [...prev, newContact]);
  };

  const handleContactDelete = (contact: Contact) => {
    setContacts(prev => prev.filter(c => c.id !== contact.id));
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
        <div className="flex-1 flex flex-col min-h-0 px-4">
          <CustomerContactTableView 
            contacts={filteredContacts}
            onContactDelete={handleContactDelete}
          />
        </div>
      </div>
    </div>
  );
}