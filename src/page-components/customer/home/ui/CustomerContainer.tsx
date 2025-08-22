"use client";
import { useState } from "react";
import customersData from "../data/customer.json";
import { CustomerPageHeader } from "./CustomerPageHeader";
import { CustomerTableView } from "./CustomerTableView";
import { AdvancedFilterSidebar, useAdvancedFilter } from "@/features/advanced-filter";
import { CUSTOMER_FILTER_CONFIG } from "../lib/customerFilterConfig";
import { CUSTOMER_SEARCHBAR_CONFIG } from "../lib/customerSearchbarConfig";
import { Customer } from "../lib/customerColumns";
import { useSearchbar } from "@/shared/GenericSearch";

export default function CustomerContainer() {
  const [currentPage, setCurrentPage] = useState(1);
  const [customers, setCustomers] = useState<Customer[]>(customersData as Customer[]);
  const itemsPerPage = 20;

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

  // 顧客更新ハンドラー
  const handleCustomerUpdate = (customerCode: string, field: string, value: unknown) => {
    setCustomers(prev => prev.map(customer => 
      customer.customerCode === customerCode 
        ? { ...customer, [field]: value }
        : customer
    ));
  };

  // 新規顧客作成ハンドラー
  const handleCustomerCreate = (customerData: Omit<Customer, 'customerCode'>) => {
    const newCustomerCode = `CUST-2024-${String(customers.length + 1).padStart(3, '0')}`;
    const newCustomer: Customer = {
      customerCode: newCustomerCode,
      ...customerData,
    };
    setCustomers(prev => [...prev, newCustomer]);
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
            onCustomerUpdate={handleCustomerUpdate}
            currentPage={currentPage}
            totalItems={filteredCustomers.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}