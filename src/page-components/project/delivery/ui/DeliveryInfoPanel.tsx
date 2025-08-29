"use client";

import { Input, Label, Textarea } from "@/shared";
import { DeliveryData } from "../model";

interface DeliveryInfoPanelProps {
  deliveryData: DeliveryData;
  onUpdate: (data: Partial<DeliveryData>) => void;
}

export function DeliveryInfoPanel({ deliveryData, onUpdate }: DeliveryInfoPanelProps) {
  const handleFieldChange = (field: keyof DeliveryData, value: string | number) => {
    onUpdate({ [field]: value });
  };

  return (
    <div className="h-full bg-white border-l overflow-y-auto">
      <div className="p-6 space-y-4">
        <div className="space-y-2">
          <Label>納品書ID</Label>
          <Input 
            value={deliveryData.delivery_id}
            disabled
            className="bg-gray-50"
          />
        </div>

        <div className="space-y-2">
          <Label>案件ID</Label>
          <Input 
            value={deliveryData.project_id}
            onChange={(e) => handleFieldChange('project_id', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>納品書番号</Label>
          <Input 
            value={deliveryData.delivery_number}
            onChange={(e) => handleFieldChange('delivery_number', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>納品日</Label>
          <Input 
            type="date"
            value={deliveryData.delivery_date ? new Date(deliveryData.delivery_date).toISOString().split('T')[0] : ''}
            onChange={(e) => handleFieldChange('delivery_date', e.target.value ? new Date(e.target.value).toISOString() : '')}
          />
        </div>

        <div className="space-y-2">
          <Label>納品先</Label>
          <Input 
            value={deliveryData.delivery_address}
            onChange={(e) => handleFieldChange('delivery_address', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>品目・数量</Label>
          <Textarea 
            value={deliveryData.delivery_details}
            onChange={(e) => handleFieldChange('delivery_details', e.target.value)}
            rows={4}
            placeholder="納品内容の詳細を入力"
          />
        </div>

        <div className="space-y-2">
          <Label>作成日時</Label>
          <Input 
            value={deliveryData.created_date}
            disabled
            className="bg-gray-50"
          />
        </div>

        <div className="space-y-2">
          <Label>作成者</Label>
          <Input 
            value={deliveryData.created_user_id}
            disabled
            className="bg-gray-50"
          />
        </div>

        <div className="space-y-2">
          <Label>更新日時</Label>
          <Input 
            value={deliveryData.modified_date}
            disabled
            className="bg-gray-50"
          />
        </div>

        <div className="space-y-2">
          <Label>更新者</Label>
          <Input 
            value={deliveryData.modified_user_id}
            disabled
            className="bg-gray-50"
          />
        </div>

        <div className="space-y-2">
          <Label>備考</Label>
          <Textarea 
            value={deliveryData.remarks}
            onChange={(e) => handleFieldChange('remarks', e.target.value)}
            rows={3}
          />
        </div>
      </div>
    </div>
  );
}