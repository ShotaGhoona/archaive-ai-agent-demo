import { CsvColumnConfig } from '@/features/csv-export';
import { Blueprint } from './blueprintColumns';

export const BLUEPRINT_CSV_COLUMNS: Omit<CsvColumnConfig<Blueprint>, 'enabled'>[] = [
  { key: 'filename', label: 'ファイル名' },
  { key: 'orderSource', label: '発注元' },
  { key: 'productName', label: '製品名' },
  { key: 'internalNumber', label: '社内整番' },
  { key: 'customerNumber', label: '客先整番' },
  { 
    key: 'orderQuantity', 
    label: '受注個数',
    formatter: (value: unknown) => String(value)
  },
  { key: 'orderDate', label: '受注日' },
  { key: 'deliveryDate', label: '納品日' },
  { key: 'companyField', label: '全社項目' },
];