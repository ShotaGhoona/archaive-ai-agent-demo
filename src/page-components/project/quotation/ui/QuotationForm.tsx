"use client";
import { useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
  Button,
} from "@/shared/shadcnui";
import { Plus, X } from "lucide-react";

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

interface QuotationFormProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

export default function QuotationForm({ formData, setFormData }: QuotationFormProps) {
  const addRow = () => {
    const newRow: TableRow = {
      id: Date.now().toString(),
      productName: "",
      unitPrice: "",
      quantity: "",
      unit: "",
      taxRate: "",
      detail: "",
    };
    setFormData(prev => ({
      ...prev,
      tableRows: [...prev.tableRows, newRow]
    }));
  };

  const removeRow = (id: string) => {
    if (formData.tableRows.length > 1) {
      setFormData(prev => ({
        ...prev,
        tableRows: prev.tableRows.filter(row => row.id !== id)
      }));
    }
  };

  const updateRow = (id: string, field: keyof TableRow, value: string) => {
    setFormData(prev => ({
      ...prev,
      tableRows: prev.tableRows.map(row =>
        row.id === id ? { ...row, [field]: value } : row
      )
    }));
  };

  const updateFormField = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="border-r bg-white h-full p-6">
        <Tabs defaultValue="project" className="w-full h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="project">案件詳細入力</TabsTrigger>
            <TabsTrigger value="company">自社情報入力</TabsTrigger>
          </TabsList>
          
          <TabsContent value="project" className="mt-6 flex-1 overflow-y-auto pr-2">
            <div className="space-y-6">
              {/* 基本情報 */}
              <div className="grid grid-cols-12 gap-4">
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

              <div className="grid grid-cols-2 gap-4">
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

              {/* 明細 */}
              <div>
                <h4 className="text-lg font-semibold mb-4">明細</h4>
                
                <div className="space-y-3">
                  {formData.tableRows.map((row, index) => (
                      <div key={row.id} className="border border-gray-200 rounded-lg bg-white hover:shadow-sm transition-shadow">
                        {/* メイン行 */}
                        <div className="grid grid-cols-12 gap-3 p-4">
                          <div className="col-span-4">
                            <Label className="text-xs text-gray-500 mb-1 block">品名</Label>
                            <Input 
                              placeholder="商品・サービス名を入力"
                              value={row.productName}
                              onChange={(e) => updateRow(row.id, 'productName', e.target.value)}
                              className="border-0 bg-gray-50 focus:bg-white focus:ring-1 focus:ring-blue-200"
                            />
                          </div>
                          <div className="col-span-2">
                            <Label className="text-xs text-gray-500 mb-1 block">単価</Label>
                            <Input 
                              placeholder="0"
                              value={row.unitPrice}
                              onChange={(e) => updateRow(row.id, 'unitPrice', e.target.value)}
                              className="border-0 bg-gray-50 focus:bg-white focus:ring-1 focus:ring-blue-200"
                            />
                          </div>
                          <div className="col-span-2">
                            <Label className="text-xs text-gray-500 mb-1 block">数量</Label>
                            <Input 
                              placeholder="1"
                              value={row.quantity}
                              onChange={(e) => updateRow(row.id, 'quantity', e.target.value)}
                              className="border-0 bg-gray-50 focus:bg-white focus:ring-1 focus:ring-blue-200"
                            />
                          </div>
                          <div className="col-span-2">
                            <Label className="text-xs text-gray-500 mb-1 block">単位</Label>
                            <Select value={row.unit} onValueChange={(value) => updateRow(row.id, 'unit', value)}>
                              <SelectTrigger className="border-0 bg-gray-50 focus:bg-white focus:ring-1 focus:ring-blue-200">
                                <SelectValue placeholder="単位" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="個">個</SelectItem>
                                <SelectItem value="台">台</SelectItem>
                                <SelectItem value="本">本</SelectItem>
                                <SelectItem value="枚">枚</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="col-span-1">
                            <Label className="text-xs text-gray-500 mb-1 block">税率</Label>
                            <Select value={row.taxRate} onValueChange={(value) => updateRow(row.id, 'taxRate', value)}>
                              <SelectTrigger className="border-0 bg-gray-50 focus:bg-white focus:ring-1 focus:ring-blue-200">
                                <SelectValue placeholder="10%" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="10">10%</SelectItem>
                                <SelectItem value="8">8%</SelectItem>
                                <SelectItem value="0">0%</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="col-span-1 flex items-center justify-center pt-5">
                            {formData.tableRows.length > 1 && (
                              <Button
                                onClick={() => removeRow(row.id)}
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-gray-400 hover:text-red-500 hover:bg-red-50"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                        
                        {/* 詳細行 */}
                        <div className="border-t border-gray-100 p-4">
                          <div className="flex items-center justify-between mb-2">
                            <Label className="text-xs text-gray-500">詳細</Label>
                            <span className="text-xs text-gray-400">{row.detail.length}/200</span>
                          </div>
                          <Textarea 
                            placeholder="商品やサービスの詳細を入力してください"
                            value={row.detail}
                            onChange={(e) => updateRow(row.id, 'detail', e.target.value)}
                            className="min-h-[60px] border-0 bg-gray-50 focus:ring-1 focus:ring-blue-200 resize-none"
                            maxLength={200}
                          />
                        </div>
                      </div>
                    ))}
                </div>
                
                {/* 行を追加ボタン */}
                <div className="mt-4">
                  <Button 
                    onClick={addRow}
                    variant="outline" 
                    size="sm"
                    className="flex items-center gap-2 hover:bg-gray-50 w-full justify-center"
                  >
                    <Plus className="h-4 w-4" />
                    行を追加
                  </Button>
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
          </TabsContent>
          
          <TabsContent value="company" className="mt-6 flex-1 overflow-y-auto pr-2">
            <div className="space-y-6">
              {/* 自社情報 */}
              <div>
                <h4 className="text-lg font-semibold mb-4">自社情報</h4>
                
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
          </TabsContent>
        </Tabs>
    </div>
  );
}