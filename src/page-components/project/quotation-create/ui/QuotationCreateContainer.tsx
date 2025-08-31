'use client';
import { useState } from 'react';
import { ResizableLayout, ResizablePanel, ResizableHandle } from '@/shared';
import { quotationCreateResizableLayoutConfig } from '../lib';
import { QuotationFormData } from '../model';
import { QuotationCreatePreview, QuotationCreateForm } from '../ui';

export function QuotationCreateContainer() {
  const [formData, setFormData] = useState<QuotationFormData>({
    clientName: '',
    honorific: '御中',
    quotationNumber: '',
    issueDate: '',
    validUntil: '',
    tableRows: [
      {
        id: '1',
        productName: '',
        unitPrice: '',
        quantity: '',
        unit: '',
        taxRate: '',
        detail: '',
      },
    ],
    remarks: '',
    companyInfo: {
      name: '株式会社STAR UP',
      phone: '080-4760-5129',
      address: '〒602-8061 京都府京都市上京区甲斐守町97西陣産業創造會館109',
    },
  });

  return (
    <ResizableLayout
      config={quotationCreateResizableLayoutConfig}
      className='h-full'
    >
      <ResizablePanel index={0}>
        <div className='h-full overflow-hidden'>
          <QuotationCreateForm formData={formData} setFormData={setFormData} />
        </div>
      </ResizablePanel>

      <ResizableHandle />

      <ResizablePanel index={1}>
        <div className='h-full overflow-hidden'>
          <QuotationCreatePreview formData={formData} />
        </div>
      </ResizablePanel>
    </ResizableLayout>
  );
}
