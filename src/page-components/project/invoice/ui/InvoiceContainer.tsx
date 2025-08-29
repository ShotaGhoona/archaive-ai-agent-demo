"use client";

import { useState } from "react";
import { DocumentDetailViewContainer } from "@/shared/view/document-detail-view";
import { InvoiceData } from "../model";
import { invoiceData as initialInvoiceData } from "../data";
import { createInvoiceDetailConfig } from "../lib/invoiceDetailConfig";

export function InvoiceContainer() {
  const [invoices] = useState<InvoiceData[]>(initialInvoiceData as InvoiceData[]);
  const config = createInvoiceDetailConfig();

  return (
    <DocumentDetailViewContainer
      data={invoices}
      config={config}
    />
  );
}