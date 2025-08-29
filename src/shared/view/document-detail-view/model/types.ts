export interface DocumentData {
  image_url: string;
  modified_date: string;
}

export interface DocumentPanelColumn<T = unknown> {
  key: keyof T | string;
  label: string;
  inputType: 'text' | 'number' | 'date' | 'select' | 'user' | 'boolean';
  editable: boolean;
  required: boolean;
  placeholder?: string;
  selectOptions?: { label: string; value: string }[];
}

export interface DocumentDetailViewConfig<T extends DocumentData> {
  documentType?: string; // "受注書", "納品書" etc.
  
  dataConfig: {
    getItemId: (item: T) => string;
    getItemTitle: (item: T) => string;
    getItemSubtitle: (item: T) => string;
    getImageUrl: (item: T) => string;
  };
  
  previewActionButtonsConfig: {
    showDeleteButton: boolean;
    showDownloadButton: boolean;
    showPrintButton: boolean;
    customButtonsRender?: (item: T, onUpdate: (data: Partial<T>) => void) => React.ReactNode;
  };
  
  createConfig: {
    enabled: boolean;
    createButtonRender?: (onCreateClick: () => void) => React.ReactNode;
  };
  
  panelColumnConfig: DocumentPanelColumn<T>[];
}

export interface DocumentDetailViewContainerProps<T extends DocumentData> {
  data: T[];
  config: DocumentDetailViewConfig<T>;
}