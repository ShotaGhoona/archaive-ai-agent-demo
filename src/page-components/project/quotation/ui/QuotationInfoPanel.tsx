"use client";

import { Input, Label, Textarea } from "@/shared";
import { QuotationData } from "../model";

interface QuotationInfoPanelProps {
  quotationData: QuotationData;
  onUpdate: (data: Partial<QuotationData>) => void;
}

export function QuotationInfoPanel({ quotationData, onUpdate }: QuotationInfoPanelProps) {
  const handleFieldChange = (field: keyof QuotationData, value: string | number) => {
    onUpdate({ [field]: value });
  };

  return (
    <div className="h-full bg-white border-l overflow-y-auto">
      <div className="p-6 space-y-4">
        <div className="space-y-2">
          <Label>案件ID</Label>
          <Input 
            value={quotationData.project_id}
            disabled
            className="bg-gray-50"
          />
        </div>

        <div className="space-y-2">
          <Label>見積書ID</Label>
          <Input 
            value={quotationData.quote_id}
            disabled
            className="bg-gray-50"
          />
        </div>

        <div className="space-y-2">
          <Label>見積番号</Label>
          <Input 
            value={quotationData.quote_number}
            onChange={(e) => handleFieldChange('quote_number', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>顧客ID</Label>
          <Input 
            value={quotationData.customer_id}
            onChange={(e) => handleFieldChange('customer_id', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>金額</Label>
          <Input 
            type="number"
            value={quotationData.total_amount}
            onChange={(e) => handleFieldChange('total_amount', parseFloat(e.target.value) || 0)}
          />
        </div>

        <div className="space-y-2">
          <Label>作成日時</Label>
          <Input 
            value={quotationData.created_date}
            disabled
            className="bg-gray-50"
          />
        </div>

        <div className="space-y-2">
          <Label>作成者</Label>
          <Input 
            value={quotationData.created_user_id}
            disabled
            className="bg-gray-50"
          />
        </div>

        <div className="space-y-2">
          <Label>更新日時</Label>
          <Input 
            value={quotationData.modified_date}
            disabled
            className="bg-gray-50"
          />
        </div>

        <div className="space-y-2">
          <Label>更新者</Label>
          <Input 
            value={quotationData.modified_user_id}
            disabled
            className="bg-gray-50"
          />
        </div>

        <div className="space-y-2">
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