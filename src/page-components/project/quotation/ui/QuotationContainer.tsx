'use client';

import { useState, useEffect } from 'react';
import { ResizableLayout, ResizablePanel, ResizableHandle } from '@/shared';
import { quotationResizableLayoutConfig } from '../lib';
import {
  DocumentQuotationDataInterface,
  projectQuotationData,
} from '@/dummy-data-er-fix/document';
import { QuotationList, QuotationPreview, QuotationInfoPanel } from '../ui';
export function QuotationContainer() {
  const [quotations] = useState<DocumentQuotationDataInterface[]>(
    projectQuotationData as DocumentQuotationDataInterface[],
  );
  const [selectedQuotation, setSelectedQuotation] =
    useState<DocumentQuotationDataInterface | null>(null);

  // 初期データとして最初の見積書を選択
  useEffect(() => {
    if (quotations.length > 0 && !selectedQuotation) {
      setSelectedQuotation(quotations[0]);
    }
  }, [quotations, selectedQuotation]);

  const handleSelectQuotation = (quotation: DocumentQuotationDataInterface) => {
    setSelectedQuotation(quotation);
  };

  const handleUpdateQuotation = (
    data: Partial<DocumentQuotationDataInterface>,
  ) => {
    if (!selectedQuotation) return;

    const updatedQuotation = { ...selectedQuotation, ...data };
    setSelectedQuotation(updatedQuotation);

    // 実際のアプリでは、ここでAPIを呼び出してデータを保存する
    console.log('見積書データを更新:', updatedQuotation);
  };

  if (!selectedQuotation) {
    return (
      <div className='flex h-full items-center justify-center'>
        <div className='text-center text-gray-500'>
          <div className='mb-4 text-4xl'>📄</div>
          <p>見積書を読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='flex h-full'>
      {/* 左側: 見積書リスト（固定幅） */}
      <div className='w-60 flex-shrink-0'>
        <QuotationList
          quotations={quotations}
          selectedId={selectedQuotation.id.toString()}
          onSelectQuotation={handleSelectQuotation}
        />
      </div>

      {/* 中央・右側: リサイズ可能レイアウト */}
      <div className='flex-1'>
        <ResizableLayout
          config={quotationResizableLayoutConfig}
          className='h-full'
        >
          <ResizablePanel index={0}>
            <div className='h-full overflow-hidden'>
              <QuotationPreview imageUrl={selectedQuotation.s3_url} />
            </div>
          </ResizablePanel>

          <ResizableHandle />

          <ResizablePanel index={1}>
            <div className='h-full overflow-hidden'>
              <QuotationInfoPanel
                quotationData={selectedQuotation}
                onUpdate={handleUpdateQuotation}
              />
            </div>
          </ResizablePanel>
        </ResizableLayout>
      </div>
    </div>
  );
}
