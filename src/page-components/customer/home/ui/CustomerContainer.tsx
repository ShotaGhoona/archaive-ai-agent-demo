"use client";
import { useState } from "react";
import customersData from "../data/customer.json";
import { CustomerPageHeader, CustomerTableView } from "../ui";
import { AdvancedFilterSidebar, useAdvancedFilter } from "@/features";
import { CUSTOMER_FILTER_CONFIG, CUSTOMER_SEARCHBAR_CONFIG } from "../lib";
import { Customer } from "../model/type";
import { useSearchbar } from "@/shared";

export function CustomerContainer() {
  const [customers, setCustomers] = useState<Customer[]>(customersData as Customer[]);

  // 分離アプローチ: 検索とAdvanced Filterを独立管理
  const {
    searchTerm,
    setSearchTerm,
    filteredData: searchFiltered,
  } = useSearchbar(customers, CUSTOMER_SEARCHBAR_CONFIG);

  const {
    filteredData: filteredCustomers,
    isOpen: isFilterSidebarOpen,
    toggleSidebar,
    filters,
    setFilters,
    clearFilters,
  } = useAdvancedFilter(searchFiltered, CUSTOMER_FILTER_CONFIG);


  // 新規顧客作成ハンドラー
  const handleCustomerCreate = (customerData: Omit<Customer, 'id' | 'company_id' | 'created_at' | 'updated_at'>) => {
    const newId = Math.max(...customers.map(c => c.id), 0) + 1;
    const newCustomer: Customer = {
      id: newId,
      company_id: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...customerData,
    };
    setCustomers(prev => [...prev, newCustomer]);
  };

  // 顧客削除ハンドラー
  const handleCustomerDelete = (customer: Customer) => {
    setCustomers(prev => prev.filter(c => c.id !== customer.id));
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
        config={CUSTOMER_FILTER_CONFIG}
      />
      
      {/* メインコンテンツ */}
      <div 
        className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${
          isFilterSidebarOpen ? 'ml-80' : 'ml-0'
        }`}
      >
        <div className="flex-shrink-0 p-4">
          <CustomerPageHeader
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onToggleFilterSidebar={toggleSidebar}
            isFilterSidebarOpen={isFilterSidebarOpen}
            customers={filteredCustomers}
            onCustomerCreate={handleCustomerCreate}
          />
        </div>
        <div className="flex-1 flex flex-col min-h-0 px-4">
          <CustomerTableView 
            customers={filteredCustomers}
            onCustomerDelete={handleCustomerDelete}
          />
        </div>
      </div>
    </div>
  );
}