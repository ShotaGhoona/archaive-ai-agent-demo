"use client";

import { Input, Label, Textarea } from "@/shared";
import { OrderData } from "../model";

interface OrderInfoPanelProps {
  orderData: OrderData;
  onUpdate: (data: Partial<OrderData>) => void;
}

export function OrderInfoPanel({ orderData, onUpdate }: OrderInfoPanelProps) {
  const handleFieldChange = (field: keyof OrderData, value: string | number) => {
    onUpdate({ [field]: value });
  };

  return (
    <div className="h-full bg-white border-l overflow-y-auto">
      <div className="p-6 space-y-4">
        <div className="space-y-2">
          <Label>受注書ID</Label>
          <Input 
            value={orderData.order_id}
            disabled
            className="bg-gray-50"
          />
        </div>

        <div className="space-y-2">
          <Label>案件ID</Label>
          <Input 
            value={orderData.project_id}
            onChange={(e) => handleFieldChange('project_id', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>受注番号</Label>
          <Input 
            value={orderData.order_number}
            onChange={(e) => handleFieldChange('order_number', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>受注日</Label>
          <Input 
            type="datetime-local"
            value={orderData.order_date ? new Date(orderData.order_date).toISOString().slice(0, 16) : ''}
            onChange={(e) => handleFieldChange('order_date', e.target.value ? new Date(e.target.value).toISOString() : '')}
          />
        </div>

        <div className="space-y-2">
          <Label>顧客ID</Label>
          <Input 
            value={orderData.customer_id}
            onChange={(e) => handleFieldChange('customer_id', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>作成日時</Label>
          <Input 
            value={orderData.created_date}
            disabled
            className="bg-gray-50"
          />
        </div>

        <div className="space-y-2">
          <Label>作成者</Label>
          <Input 
            value={orderData.created_user_id}
            disabled
            className="bg-gray-50"
          />
        </div>

        <div className="space-y-2">
          <Label>更新日時</Label>
          <Input 
            value={orderData.modified_date}
            disabled
            className="bg-gray-50"
          />
        </div>

        <div className="space-y-2">
          <Label>更新者</Label>
          <Input 
            value={orderData.modified_user_id}
            disabled
            className="bg-gray-50"
          />
        </div>

        <div className="space-y-2">
          <Label>備考</Label>
          <Textarea 
            value={orderData.remarks}
            onChange={(e) => handleFieldChange('remarks', e.target.value)}
            rows={3}
          />
        </div>
      </div>
    </div>
  );
}