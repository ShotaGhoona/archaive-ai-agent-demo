import { FilterToggleButton, CsvExportDialog } from "@/features";
import { SearchInput } from "@/shared";
import { DocumentPageHeaderProps, DocumentType } from '../model';
import { 
  QUOTATION_CSV_COLUMNS,
  ORDER_CSV_COLUMNS,
  DELIVERY_CSV_COLUMNS,
  INVOICE_CSV_COLUMNS,
  SPECIFICATION_CSV_COLUMNS,
  INSPECTION_CSV_COLUMNS,
} from '../lib';

const getFilename = (type: DocumentType) => {
  switch (type) {
    case 'quotation': return 'quotations';
    case 'order': return 'orders';
    case 'delivery': return 'deliveries';
    case 'invoice': return 'invoices';
    case 'specification': return 'specifications';
    case 'inspection': return 'inspections';
    default: return 'documents';
  }
};

const getSearchPlaceholder = (type: DocumentType) => {
  switch (type) {
    case 'quotation': return '見積書名・案件名・顧客名で検索';
    case 'order': return '発注書名・案件名・発注先で検索';
    case 'delivery': return '納品書名・案件名・納品先で検索';
    case 'invoice': return '請求書名・案件名・請求先で検索';
    case 'specification': return '仕様書名・案件名・図面名で検索';
    case 'inspection': return '検査表名・案件名で検索';
    default: return '帳票名で検索';
  }
};

const getCsvColumns = (type: DocumentType) => {
  switch (type) {
    case 'quotation': return QUOTATION_CSV_COLUMNS;
    case 'order': return ORDER_CSV_COLUMNS;
    case 'delivery': return DELIVERY_CSV_COLUMNS;
    case 'invoice': return INVOICE_CSV_COLUMNS;
    case 'specification': return SPECIFICATION_CSV_COLUMNS;
    case 'inspection': return INSPECTION_CSV_COLUMNS;
    default: return QUOTATION_CSV_COLUMNS;
  }
};

export function DocumentPageHeader({
  searchTerm,
  setSearchTerm,
  onToggleFilterSidebar,
  isFilterSidebarOpen,
  documents,
  selectedType,
}: DocumentPageHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <FilterToggleButton
          isOpen={isFilterSidebarOpen}
          onToggle={onToggleFilterSidebar}
        />
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder={getSearchPlaceholder(selectedType)}
        />
      </div>
      <div className="flex items-center gap-3">
        <CsvExportDialog
          key={selectedType}
          data={documents as any}
          initialColumns={getCsvColumns(selectedType) as any}
          defaultFilename={getFilename(selectedType)}
        />
      </div>
    </div>
  );
}