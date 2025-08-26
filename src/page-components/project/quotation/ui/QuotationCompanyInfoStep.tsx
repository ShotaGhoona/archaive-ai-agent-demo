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
  Button,
} from "@/shared";

interface QuotationCompanyInfoStepProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
}

export function QuotationCompanyInfoStep({ formData, setFormData }: QuotationCompanyInfoStepProps) {
  const updateFormField = (field: keyof FormData, value: unknown) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="p-6">
      <div className="space-y-6">
        {/* 自社情報 */}
        <div>
          <h3 className="text-lg font-semibold mb-4">自社情報</h3>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <Label className="text-sm font-medium">会社情報</Label>
              <Input 
                placeholder="会社名を入力してください"
                value={formData.companyInfo.name}
                onChange={(e) => updateFormField('companyInfo', { ...formData.companyInfo, name: e.target.value })}
              />
            </div>
            <div>
              <Label className="text-sm font-medium">電話番号</Label>
              <Input 
                placeholder="電話番号を入力してください"
                value={formData.companyInfo.phone}
                onChange={(e) => updateFormField('companyInfo', { ...formData.companyInfo, phone: e.target.value })}
              />
            </div>
          </div>

          <div className="mb-4">
            <Label className="text-sm font-medium">住所</Label>
            <Textarea 
              placeholder="住所を入力してください"
              value={formData.companyInfo.address}
              onChange={(e) => updateFormField('companyInfo', { ...formData.companyInfo, address: e.target.value })}
              className="min-h-[80px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium">ロゴ</Label>
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors min-h-[120px] flex items-center justify-center"
                onClick={() => document.getElementById('logo-upload')?.click()}
              >
                {formData.companyInfo.logo ? (
                  <img 
                    src={formData.companyInfo.logo} 
                    alt="ロゴ"
                    className="max-h-20 max-w-full mx-auto object-contain"
                  />
                ) : (
                  <div className="text-center">
                    <div className="text-4xl text-blue-400 mb-2">📁</div>
                    <p className="text-sm text-gray-600">ファイルをここにドラッグ&ドロップ</p>
                    <p className="text-xs text-gray-500 mt-1">またはクリックで画像ファイルをアップロード</p>
                  </div>
                )}
              </div>
              <input
                id="logo-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                      updateFormField('companyInfo', { 
                        ...formData.companyInfo, 
                        logo: e.target?.result as string 
                      });
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </div>
            <div>
              <Label className="text-sm font-medium">印影</Label>
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors min-h-[120px] flex items-center justify-center"
                onClick={() => document.getElementById('stamp-upload')?.click()}
              >
                {formData.companyInfo.stamp ? (
                  <img 
                    src={formData.companyInfo.stamp} 
                    alt="印影"
                    className="max-h-20 max-w-full mx-auto object-contain"
                  />
                ) : (
                  <div className="text-center">
                    <div className="text-4xl text-blue-400 mb-2">📁</div>
                    <p className="text-sm text-gray-600">ファイルをここにドラッグ&ドロップ</p>
                    <p className="text-xs text-gray-500 mt-1">またはクリックで画像ファイルをアップロード</p>
                  </div>
                )}
              </div>
              <input
                id="stamp-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                      updateFormField('companyInfo', { 
                        ...formData.companyInfo, 
                        stamp: e.target?.result as string 
                      });
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* 担当者情報 */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold">担当者情報</h4>
            <Button variant="link" className="text-sm text-blue-600">
              全ての担当者を確認 →
            </Button>
          </div>
          
          <div>
            <Label className="text-sm font-medium">担当者</Label>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="担当者を選択" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tanaka">田中太郎</SelectItem>
                <SelectItem value="sato">佐藤花子</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* 見積書番号ルール設定 */}
        <div>
          <h4 className="text-lg font-semibold mb-4">見積書番号ルール設定</h4>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <Label className="text-sm font-medium">プレフィックス文字</Label>
              <Input placeholder="プレフィックス文字を入力" />
            </div>
            <div>
              <Label className="text-sm font-medium">連番の桁数（例：0001, 0010, 0100など）</Label>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="桁数を選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3桁</SelectItem>
                  <SelectItem value="4">4桁</SelectItem>
                  <SelectItem value="5">5桁</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium">開始番号（数値入力）</Label>
              <Input placeholder="開始番号を入力してください" />
            </div>
            <div>
              <Label className="text-sm font-medium">更新ルール</Label>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="更新ルールを選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="every">毎回</SelectItem>
                  <SelectItem value="daily">毎日</SelectItem>
                  <SelectItem value="monthly">毎月</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}