'use client';

import { useState } from 'react';
import { Card, CardContent, Button } from '@/shared';
import { FileText } from 'lucide-react';
import { DocumentQuotationDataInterface } from '@/dummy-data-er-fix/document';
import { QuotationRegistrationDialog } from './QuotationRegistrationDialog';

interface QuotationListProps {
  quotations: DocumentQuotationDataInterface[];
  selectedId: string;
  onSelectQuotation: (quotation: DocumentQuotationDataInterface) => void;
}

export function QuotationList({
  quotations,
  selectedId,
  onSelectQuotation,
}: QuotationListProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSelectQuotation = (quotation: DocumentQuotationDataInterface) => {
    onSelectQuotation(quotation);
  };

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  return (
    <div className='flex h-full flex-col border-r bg-white'>
      {/* 見積書リスト */}
      <div className='mt-4 flex-1 space-y-4 p-4 pt-0'>
        <Button
          size='lg'
          variant='outline'
          className='w-full py-8'
          onClick={handleOpenDialog}
        >
          <FileText className='mr-2 h-4 w-4' />
          見積書を登録or作成
        </Button>
        {quotations
          .sort(
            (a, b) => b.version - a.version,
          )
          .map((quotation) => (
            <Card
              key={quotation.id}
              onClick={() => handleSelectQuotation(quotation)}
              className={`group relative cursor-pointer py-1 transition-all duration-200 ${
                selectedId === quotation.id.toString()
                  ? 'ring-primary ring-2'
                  : 'hover:bg-gray-50 hover:shadow-md'
              } `}
            >
              <CardContent className='p-2'>
                <div className='space-y-2'>
                  <div className='aspect-video w-full overflow-hidden rounded bg-gray-100'>
                    {quotation.s3_url ? (
                      <img
                        src={quotation.s3_url}
                        alt={quotation.quotation_number}
                        className='h-full w-full object-cover'
                        loading='lazy'
                      />
                    ) : (
                      <div className='flex h-full w-full items-center justify-center'>
                        <FileText className='h-8 w-8 text-gray-400' />
                      </div>
                    )}
                  </div>
                  <div className='px-1'>
                    <h4 className='truncate text-xs font-medium text-gray-900'>
                      {quotation.quotation_number}
                    </h4>
                    <p className='mt-1 text-xs text-gray-500'>
                      {new Date(quotation.updated_at).toLocaleDateString(
                        'ja-JP',
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>

      <QuotationRegistrationDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
      />
    </div>
  );
}
