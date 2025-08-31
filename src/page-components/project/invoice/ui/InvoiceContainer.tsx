'use client';

import { useState } from 'react';
import { DocumentDetailViewContainer } from '@/shared/view/document-detail-view';
import {
  DocumentInvoiceDataInterface,
  projectInvoiceData,
} from '@/dummy-data-er-fix/document';
import { createInvoiceDetailConfig } from '../lib/invoiceDetailConfig';

export function InvoiceContainer() {
  const [invoices] = useState<DocumentInvoiceDataInterface[]>(
    projectInvoiceData as DocumentInvoiceDataInterface[],
  );
  const config = createInvoiceDetailConfig();

  return <DocumentDetailViewContainer data={invoices} config={config} />;
}
