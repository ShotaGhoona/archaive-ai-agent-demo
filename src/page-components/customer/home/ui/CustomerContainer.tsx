'use client';
import { useState } from 'react';
import { CustomerPageHeader, CustomerTableView } from '../ui';
import {
  AdvancedFilterSidebar,
  useAdvancedFilter,
  useSearchbar,
} from '@/shared';
import { setValue } from '@/shared';
import { CUSTOMER_FILTER_CONFIG, CUSTOMER_SEARCHBAR_CONFIG } from '../lib';
import {
  CustomerHomeDataInterface,
  customerHomeData,
} from '@/dummy-data-er-fix/customer';

export function CustomerContainer() {
  const [customers, setCustomers] = useState<CustomerHomeDataInterface[]>(
    customerHomeData as CustomerHomeDataInterface[],
  );

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
  const handleCustomerCreate = (
    customerData: Omit<
      CustomerHomeDataInterface,
      'id' | 'company_id' | 'created_at' | 'updated_at' | 'created_by_name'
    >,
  ) => {
    const newId = Math.max(...customers.map((c) => c.id), 0) + 1;
    const newCustomer: CustomerHomeDataInterface = {
      id: newId,
      company_id: 1,
      created_by_name: '管理者',  // TODO: 実際のユーザー名を取得
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...customerData,
    };
    setCustomers((prev) => [...prev, newCustomer]);
  };

  // 顧客削除ハンドラー
  const handleCustomerDelete = (customer: CustomerHomeDataInterface) => {
    setCustomers((prev) => prev.filter((c) => c.id !== customer.id));
  };

  // 顧客更新ハンドラー
  const handleCustomerUpdate = (
    rowId: string,
    field: string,
    value: unknown,
  ) => {
    setCustomers((prev) =>
      prev.map((customer) => {
        if (customer.id.toString() === rowId) {
          const updatedCustomer = { ...customer };
          setValue(updatedCustomer, field, value);
          updatedCustomer.updated_at = new Date().toISOString();
          return updatedCustomer;
        }
        return customer;
      }),
    );
  };

  return (
    <div className='flex h-[calc(100vh-60px)] overflow-hidden'>
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
        className={`flex flex-1 flex-col overflow-hidden transition-all duration-300 ${
          isFilterSidebarOpen ? 'ml-80' : 'ml-0'
        }`}
      >
        <div className='flex-shrink-0 p-4'>
          <CustomerPageHeader
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onToggleFilterSidebar={toggleSidebar}
            isFilterSidebarOpen={isFilterSidebarOpen}
            customers={filteredCustomers}
            onCustomerCreate={handleCustomerCreate}
          />
        </div>
        <div className='flex min-h-0 flex-1 flex-col px-4'>
          <CustomerTableView
            customers={filteredCustomers}
            onCustomerDelete={handleCustomerDelete}
            onCustomerUpdate={handleCustomerUpdate}
          />
        </div>
      </div>
    </div>
  );
}
