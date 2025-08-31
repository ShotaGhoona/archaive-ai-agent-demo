'use client';
import { useState } from 'react';
import {
  documentHomeQuotationData,
  DocumentQuotationDataInterface,
} from '@/dummy-data-er-fix/document';
import {
  DocumentHomeQuotationPageHeader,
  DocumentHomeQuotationTableView,
} from '../ui';
import {
  AdvancedFilterSidebar,
  useAdvancedFilter,
  useSearchbar,
} from '@/shared';
import { QUOTATION_FILTER_CONFIG, QUOTATION_SEARCHBAR_CONFIG } from '../lib';
export function DocumentHomeQuotationContainer() {
  const [quotations, setQuotations] = useState<DocumentQuotationDataInterface[]>(
    documentHomeQuotationData as DocumentQuotationDataInterface[],
  );

  // 検索機能
  const {
    searchTerm,
    setSearchTerm,
    filteredData: searchFiltered,
  } = useSearchbar(quotations, QUOTATION_SEARCHBAR_CONFIG);

  // アドバンスドフィルター機能
  const {
    filteredData: filteredQuotations,
    isOpen: isFilterSidebarOpen,
    toggleSidebar,
    filters,
    setFilters,
    clearFilters,
  } = useAdvancedFilter(searchFiltered, QUOTATION_FILTER_CONFIG);

  // 見積書削除ハンドラー
  const handleQuotationDelete = (quotation: DocumentQuotationDataInterface) => {
    setQuotations((prev) =>
      prev.filter((q) => q.id !== quotation.id),
    );
  };

  // 見積書更新ハンドラー
  const handleQuotationUpdate = (
    rowId: string,
    field: string,
    value: unknown,
  ) => {
    setQuotations((prev) =>
      prev.map((quotation) => {
        if (quotation.id.toString() === rowId) {
          const updatedQuotation = { ...quotation, [field]: value };
          updatedQuotation.updated_at = new Date().toISOString();
          return updatedQuotation;
        }
        return quotation;
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
        config={QUOTATION_FILTER_CONFIG}
      />

      {/* メインコンテンツ */}
      <div
        className={`flex flex-1 flex-col overflow-hidden transition-all duration-300 ${
          isFilterSidebarOpen ? 'ml-80' : 'ml-0'
        }`}
      >
        <div className='flex-shrink-0 p-4'>
          <DocumentHomeQuotationPageHeader
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onToggleFilterSidebar={toggleSidebar}
            isFilterSidebarOpen={isFilterSidebarOpen}
            quotations={filteredQuotations}
          />
        </div>
        <div className='flex min-h-0 flex-1 flex-col px-4'>
          <DocumentHomeQuotationTableView
            quotations={filteredQuotations}
            onQuotationDelete={handleQuotationDelete}
            onQuotationUpdate={handleQuotationUpdate}
          />
        </div>
      </div>
    </div>
  );
}
