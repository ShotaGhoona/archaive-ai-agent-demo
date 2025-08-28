"use client";
import { useState } from "react";
import { invoiceData } from "../data";
import { DocumentHomeInvoicePageHeader, DocumentHomeInvoiceTableView } from "../ui";
import { AdvancedFilterSidebar, useAdvancedFilter, useSearchbar } from "@/shared";
import { INVOICE_FILTER_CONFIG, INVOICE_SEARCHBAR_CONFIG } from "../lib";
import { Invoice } from "../model";

export function DocumentHomeInvoiceContainer() {
  const [invoices, setInvoices] = useState<Invoice[]>(invoiceData as Invoice[]);

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
  const handleInvoiceDelete = (invoice: Invoice) => {
    setInvoices(prev => prev.filter(i => i.id !== invoice.id));
  };

  // 請求書更新ハンドラー
  const handleInvoiceUpdate = (rowId: string, field: string, value: unknown) => {
    setInvoices(prev => prev.map(invoice => 
      invoice.id.toString() === rowId 
        ? { ...invoice, [field]: value }
        : invoice
    ));
  };

  return (
    <div className="h-full flex overflow-hidden">
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
        className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${
          isFilterSidebarOpen ? 'ml-80' : 'ml-0'
        }`}
      >
        <div className="flex-shrink-0 p-4">
          <DocumentHomeInvoicePageHeader
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onToggleFilterSidebar={toggleSidebar}
            isFilterSidebarOpen={isFilterSidebarOpen}
            invoices={filteredInvoices}
          />
        </div>
        <div className="flex-1 flex flex-col min-h-0 px-4">
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