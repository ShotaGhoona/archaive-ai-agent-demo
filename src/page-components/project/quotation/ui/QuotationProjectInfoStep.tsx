import { FormData } from "../model";
import {
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "@/shared";

interface QuotationProjectInfoStepProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
}

export function QuotationProjectInfoStep({ formData, setFormData }: QuotationProjectInfoStepProps) {
  const updateFormField = (field: keyof FormData, value: unknown) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="p-6">
      {/* 基本情報 */}
      <div className="grid grid-cols-12 gap-4 mb-6">
        <div className="col-span-4">
          <Label className="text-sm font-medium">取引先</Label>
          <Select value={formData.clientName} onValueChange={(value) => updateFormField('clientName', value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="取引先を選択してください" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="株式会社STAR UP">株式会社STAR UP</SelectItem>
              <SelectItem value="株式会社ABC商事">株式会社ABC商事</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-2">
          <Label className="text-sm font-medium">&nbsp;</Label>
          <Select value={formData.honorific} onValueChange={(value) => updateFormField('honorific', value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="御中" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="御中">御中</SelectItem>
              <SelectItem value="様">様</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-6">
          <Label className="text-sm font-medium">見積書番号</Label>
          <Input 
            placeholder="見積書番号を入力してください"
            value={formData.quotationNumber}
            onChange={(e) => updateFormField('quotationNumber', e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <Label className="text-sm font-medium">発行日</Label>
          <Select value={formData.issueDate} onValueChange={(value) => updateFormField('issueDate', value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="発行日を選択してください" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2025/08/08">2025/08/08</SelectItem>
              <SelectItem value="2025/08/09">2025/08/09</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-sm font-medium">有効期限</Label>
          <Select value={formData.validUntil} onValueChange={(value) => updateFormField('validUntil', value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="有効期限を選択してください" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2025/09/08">2025/09/08</SelectItem>
              <SelectItem value="2025/09/15">2025/09/15</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 備考 */}
      <div>
        <Label className="text-sm font-medium mb-2 block">備考</Label>
        <Textarea 
          placeholder="備考を入力してください"
          value={formData.remarks}
          onChange={(e) => updateFormField('remarks', e.target.value)}
          className="min-h-[100px]"
        />
      </div>
    </div>
  );
}