export interface CsvColumnConfig<T = any> {
  key: keyof T;
  label: string;
  enabled: boolean;
  formatter?: (value: any) => string;
}

export interface CsvExportConfig<T = any> {
  columns: CsvColumnConfig<T>[];
  filename: string;
  encoding: 'utf-8' | 'shift_jis';
  includeHeader: boolean;
}

export interface CsvExportDialogProps<T = any> {
  data: T[];
  initialColumns: Omit<CsvColumnConfig<T>, 'enabled'>[];
  defaultFilename: string;
  title?: string;
  maxPreviewRows?: number;
}

export interface UseCsvExportReturn<T = any> {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  encoding: 'utf-8' | 'shift_jis';
  setEncoding: (encoding: 'utf-8' | 'shift_jis') => void;
  includeHeader: boolean;
  setIncludeHeader: (include: boolean) => void;
  columns: CsvColumnConfig<T>[];
  setColumns: (columns: CsvColumnConfig<T>[]) => void;
  handleColumnToggle: (index: number) => void;
  toggleAllColumns: (enabled: boolean) => void;
  handleDragStart: (e: React.DragEvent, index: number) => void;
  handleDragOver: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent, dropIndex: number) => void;
  getPreviewData: () => { headers: string[]; rows: string[][] };
  generateCsv: () => void;
  enabledCount: number;
}