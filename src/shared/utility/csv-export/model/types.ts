export interface CsvColumnConfig<T = Record<string, unknown>> {
  key: keyof T;
  label: string;
  enabled: boolean;
  formatter?: (value: unknown) => string;
}

export interface CsvExportConfig<T = Record<string, unknown>> {
  columns: CsvColumnConfig<T>[];
  filename: string;
  encoding: 'utf-8' | 'shift_jis';
  includeHeader: boolean;
}

export interface CsvExportDialogProps<T = Record<string, unknown>> {
  data: T[];
  initialColumns: Omit<CsvColumnConfig<T>, 'enabled'>[];
  defaultFilename: string;
  title?: string;
  maxPreviewRows?: number;
}

export interface UseCsvExportReturn<T = Record<string, unknown>> {
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