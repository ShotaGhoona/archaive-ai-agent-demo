'use client';

import { Input, Label, Textarea } from '@/shared';
import { DocumentQuotationDataInterface } from '@/dummy-data-er-fix/document';

interface QuotationInfoPanelProps {
  quotationData: DocumentQuotationDataInterface;
  onUpdate: (data: Partial<DocumentQuotationDataInterface>) => void;
}

export function QuotationInfoPanel({
  quotationData,
  onUpdate,
}: QuotationInfoPanelProps) {
  const handleFieldChange = (
    field: keyof DocumentQuotationDataInterface,
    value: string | number,
  ) => {
    onUpdate({ [field]: value });
  };

  return (
    <div className='h-full overflow-y-auto border-l bg-white'>
      <div className='space-y-4 p-6'>
        <div className='space-y-2'>
          <Label>ID</Label>
          <Input
            value={quotationData.id}
            disabled
            className='bg-gray-50'
          />
        </div>

        <div className='space-y-2'>
          <Label>ディレクトリ名</Label>
          <Input
            value={quotationData.directory_name}
            onChange={(e) => handleFieldChange('directory_name', e.target.value)}
          />
        </div>

        <div className='space-y-2'>
          <Label>顧客名</Label>
          <Input
            value={quotationData.customer_name}
            onChange={(e) => handleFieldChange('customer_name', e.target.value)}
          />
        </div>

        <div className='space-y-2'>
          <Label>会社名</Label>
          <Input
            value={quotationData.company_name}
            onChange={(e) => handleFieldChange('company_name', e.target.value)}
          />
        </div>

        <div className='space-y-2'>
          <Label>見積書番号</Label>
          <Input
            value={quotationData.quotation_number}
            onChange={(e) => handleFieldChange('quotation_number', e.target.value)}
          />
        </div>

        <div className='space-y-2'>
          <Label>有効期限</Label>
          <Input
            type='date'
            value={quotationData.expiration_date}
            onChange={(e) => handleFieldChange('expiration_date', e.target.value)}
          />
        </div>

        <div className='space-y-2'>
          <Label>バージョン</Label>
          <Input
            type='number'
            value={quotationData.version}
            onChange={(e) =>
              handleFieldChange('version', parseInt(e.target.value) || 1)
            }
          />
        </div>

        <div className='space-y-2'>
          <Label>作成日時</Label>
          <Input
            value={new Date(quotationData.created_at).toLocaleDateString('ja-JP')}
            disabled
            className='bg-gray-50'
          />
        </div>

        <div className='space-y-2'>
          <Label>作成者</Label>
          <Input
            value={quotationData.created_by_name}
            disabled
            className='bg-gray-50'
          />
        </div>

        <div className='space-y-2'>
          <Label>更新日時</Label>
          <Input
            value={new Date(quotationData.updated_at).toLocaleDateString('ja-JP')}
            disabled
            className='bg-gray-50'
          />
        </div>

        <div className='space-y-2'>
          <Label>更新者</Label>
          <Input
            value={quotationData.updated_by_name}
            disabled
            className='bg-gray-50'
          />
        </div>

        <div className='space-y-2'>
          <Label>備考</Label>
          <Textarea
            value={quotationData.remarks}
            onChange={(e) => handleFieldChange('remarks', e.target.value)}
            rows={3}
          />
        </div>
      </div>
    </div>
  );
}
