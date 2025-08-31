'use client';
import { useState } from 'react';
import {
  documentHomeInvoiceData,
  DocumentInvoiceDataInterface,
} from '@/dummy-data-er-fix/document';
import {
  DocumentHomeInvoicePageHeader,
  DocumentHomeInvoiceTableView,
} from '../ui';
import {
  AdvancedFilterSidebar,
  useAdvancedFilter,
  useSearchbar,
  setValue,
} from '@/shared';
import { INVOICE_FILTER_CONFIG, INVOICE_SEARCHBAR_CONFIG } from '../lib';

export function DocumentHomeInvoiceContainer() {
  const [invoices, setInvoices] = useState<DocumentInvoiceDataInterface[]>(
    documentHomeInvoiceData as DocumentInvoiceDataInterface[],
  );

  // 検索機能
  const {
    searchTerm,
    setSearchTerm,
    filteredData: searchFiltered,
  } = useSearchbar(invoices, INVOICE_SEARCHBAR_CONFIG);

  // アドバンスドフィルター機能
  const {
    filteredData: filteredInvoices,
    isOpen: isFilterSidebarOpen,
    toggleSidebar,
    filters,
    setFilters,
    clearFilters,
  } = useAdvancedFilter(searchFiltered, INVOICE_FILTER_CONFIG);

  // 請求書削除ハンドラー
  const handleInvoiceDelete = (invoice: DocumentInvoiceDataInterface) => {
    setInvoices((prev) =>
      prev.filter((i) => i.id !== invoice.id),
    );
  };

  // 請求書更新ハンドラー
  const handleInvoiceUpdate = (
    rowId: string,
    field: string,
    value: unknown,
  ) => {
    setInvoices((prev) =>
      prev.map((invoice) => {
        if (invoice.id.toString() === rowId) {
          const updatedInvoice = { ...invoice };
          setValue(updatedInvoice, field, value);
          updatedInvoice.updated_at = new Date().toISOString();
          return updatedInvoice;
        }
        return invoice;
      }),
    );
  };

  return (
    <div className='flex h-full overflow-hidden'>
      {/* フィルターサイドバー */}
      <AdvancedFilterSidebar
        isOpen={isFilterSidebarOpen}
        onToggle={toggleSidebar}
        filters={filters}
        onFiltersChange={setFilters}
        onClearFilters={clearFilters}
        config={INVOICE_FILTER_CONFIG}
      />

      {/* メインコンテンツ */}
      <div
        className={`flex flex-1 flex-col overflow-hidden transition-all duration-300 ${
          isFilterSidebarOpen ? 'ml-80' : 'ml-0'
        }`}
      >
        <div className='flex-shrink-0 p-4'>
          <DocumentHomeInvoicePageHeader
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onToggleFilterSidebar={toggleSidebar}
            isFilterSidebarOpen={isFilterSidebarOpen}
            invoices={filteredInvoices}
          />
        </div>
        <div className='flex min-h-0 flex-1 flex-col px-4'>
          <DocumentHomeInvoiceTableView
            invoices={filteredInvoices}
            onInvoiceDelete={handleInvoiceDelete}
            onInvoiceUpdate={handleInvoiceUpdate}
          />
        </div>
      </div>
    </div>
  );
}
