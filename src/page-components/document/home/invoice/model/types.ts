import { DocumentInvoiceDataInterface } from '@/dummy-data-er-fix/document';

export interface InvoiceColumnCallbacks {
  onDelete?: (invoice: DocumentInvoiceDataInterface) => void;
}
