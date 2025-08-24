"use client";
import { useState } from "react";
import { QuotationForm, QuotationPreview } from "../ui";
import { ResizableLayout, ResizablePanel, ResizableHandle } from "@/features/resizable-layout";
import { quotationConfig } from "../lib/resizableLayoutConfig";

interface TableRow {
  id: string;
  productName: string;
  unitPrice: string;
  quantity: string;
  unit: string;
  taxRate: string;
  detail: string;
}

interface FormData {
  clientName: string;
  honorific: string;
  quotationNumber: string;
  issueDate: string;
  validUntil: string;
  tableRows: TableRow[];
  remarks: string;
  companyInfo: {
    name: string;
    phone: string;
    address: string;
    logo?: string;
    stamp?: string;
  };
}

export function QuotationContainer() {
  const [formData, setFormData] = useState<FormData>({
    clientName: "",
    honorific: "御中",
    quotationNumber: "",
    issueDate: "",
    validUntil: "",
    tableRows: [{
      id: "1",
      productName: "",
      unitPrice: "",
      quantity: "",
      unit: "",
      taxRate: "",
      detail: "",
    }],
    remarks: "",
    companyInfo: {
      name: "株式会社STAR UP",
      phone: "080-4760-5129",
      address: "〒602-8061 京都府京都市上京区甲斐守町97西陣産業創造會館109"
    }
  });

  return (
    <ResizableLayout config={quotationConfig} className="h-full">
      <ResizablePanel index={0}>
        <div className="h-full overflow-hidden">
          <QuotationForm formData={formData} setFormData={setFormData} />
        </div>
      </ResizablePanel>
      
      <ResizableHandle />
      
      <ResizablePanel index={1}>
        <div className="h-full overflow-hidden">
          <QuotationPreview formData={formData} />
        </div>
      </ResizablePanel>
    </ResizableLayout>
  );
}