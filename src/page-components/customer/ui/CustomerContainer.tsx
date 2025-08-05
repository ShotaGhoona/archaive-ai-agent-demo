"use client";
import { useState } from "react";
import customersData from "@/page-components/customer/data/customer.json";
import { CustomerPageHeader } from "./CustomerPageHeader";
import { CustomerTableView } from "./CustomerTableView";
import { CustomerPagination } from "./CustomerPagination";
import { AdvancedFilterSidebar, useAdvancedFilter } from "@/features/advanced-filter";
import { CUSTOMER_FILTER_CONFIG } from "../lib/customerFilterConfig";
import { Customer } from "../lib/customerColumns";

export default function CustomerContainer() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [customers, setCustomers] = useState<Customer[]>(customersData as Customer[]);
  const itemsPerPage = 20;

  // Advanced Filter Hook
  const {
    filteredData: filteredByAdvancedFilter,
    isOpen: isFilterSidebarOpen,
    toggleSidebar,
    filters,
    setFilters,
    clearFilters,
  } = useAdvancedFilter(customers, CUSTOMER_FILTER_CONFIG);

  // フィルタリングされたデータ
  const filteredCustomers = filteredByAdvancedFilter.filter((customer) => {
    // 基本検索
    const matchesSearch =
      customer.customerCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.salesRepresentative.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.industry.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  // ページネーション
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentCustomers = filteredCustomers.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

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
            customers={currentCustomers}
            onCustomerUpdate={handleCustomerUpdate}
          />
        </div>
        <div className="flex-shrink-0 p-4">
          <CustomerPagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}