import { useState } from "react";
import {
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
} from "@/components/ui";
import { ChevronLeft, Search, RotateCcw } from "lucide-react";

interface FilterSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  filters: {
    ocrSearch: string;
    filename: string;
    orderSource: string;
    productName: string;
    internalNumber: string;
    customerNumber: string;
    cadName: string;
    camName: string;
    orderQuantity: string;
    orderDateFrom: string;
    orderDateTo: string;
    deliveryDateFrom: string;
    deliveryDateTo: string;
    companyField: string;
  };
  onFiltersChange: (filters: any) => void;
  onClearFilters: () => void;
}

export function FilterSidebar({
  isOpen,
  onToggle,
  filters,
  onFiltersChange,
  onClearFilters,
}: FilterSidebarProps) {
  const cadOptions = [
    "AutoCAD 2024",
    "SolidWorks 2024", 
    "Inventor 2024",
    "CATIA V5"
  ];

  const camOptions = [
    "Mastercam X9",
    "CAMWorks",
    "PowerMill",
    "ESPRIT",
    "GibbsCAM",
    "EdgeCAM",
    "hyperMILL"
  ];

  const companyFields = [
    "自動車部品",
    "産業機械",
    "重機部品",
    "減速機",
    "精密機械",
    "電気機械",
    "電子機器",
    "サスペンション",
    "ポンプ機器",
    "建設機械",
    "油圧機器",
    "歯車",
    "流体制御",
    "治具",
    "熱機器",
    "センサー",
    "駆動系",
    "フィルター",
    "関節部品",
    "圧縮機"
  ];

  const updateFilter = (key: string, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  return (
    <>
      {/* オーバーレイ */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}
      
      {/* サイドバー */}
      <div
        className={`
          fixed left-0 top-[45px] h-[calc(100vh-45px)] bg-white border-r shadow-lg z-50 transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          w-80 flex flex-col
        `}
      >
        {/* ヘッダー */}
        <div className="flex items-center justify-between p-4 border-b bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-900">詳細フィルター</h2>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onClearFilters}
              className="text-xs"
            >
              <RotateCcw className="h-3 w-3 mr-1" />
              クリア
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* フィルター内容 */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* OCR検索 */}
          <div>
            <Label className="text-sm font-medium text-gray-900">OCR検索</Label>
            <div className="mt-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="図面内のテキストを検索"
                value={filters.ocrSearch}
                onChange={(e) => updateFilter("ocrSearch", e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Separator />

          {/* ファイル名 */}
          <div>
            <Label htmlFor="filename" className="text-sm font-medium text-gray-900">
              ファイル名
            </Label>
            <Input
              id="filename"
              placeholder="ファイル名を入力"
              value={filters.filename}
              onChange={(e) => updateFilter("filename", e.target.value)}
              className="mt-2"
            />
          </div>

          {/* 発注元 */}
          <div>
            <Label htmlFor="order-source" className="text-sm font-medium text-gray-900">
              発注元
            </Label>
            <Input
              id="order-source"
              placeholder="発注元を入力"
              value={filters.orderSource}
              onChange={(e) => updateFilter("orderSource", e.target.value)}
              className="mt-2"
            />
          </div>

          {/* 製品名 */}
          <div>
            <Label htmlFor="product-name" className="text-sm font-medium text-gray-900">
              製品名
            </Label>
            <Input
              id="product-name"
              placeholder="製品名を入力"
              value={filters.productName}
              onChange={(e) => updateFilter("productName", e.target.value)}
              className="mt-2"
            />
          </div>

          <Separator />

          {/* 社内製番 */}
          <div>
            <Label htmlFor="internal-number" className="text-sm font-medium text-gray-900">
              社内製番
            </Label>
            <Input
              id="internal-number"
              placeholder="社内製番を入力"
              value={filters.internalNumber}
              onChange={(e) => updateFilter("internalNumber", e.target.value)}
              className="mt-2"
            />
          </div>

          {/* 客先製番 */}
          <div>
            <Label htmlFor="customer-number" className="text-sm font-medium text-gray-900">
              客先製番
            </Label>
            <Input
              id="customer-number"
              placeholder="客先製番を入力"
              value={filters.customerNumber}
              onChange={(e) => updateFilter("customerNumber", e.target.value)}
              className="mt-2"
            />
          </div>

          <Separator />

          {/* CAD名 */}
          <div>
            <Label htmlFor="cad-name" className="text-sm font-medium text-gray-900">
              CAD名
            </Label>
            <Select value={filters.cadName} onValueChange={(value) => updateFilter("cadName", value)}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="CADを選択" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">すべて</SelectItem>
                {cadOptions.map((cad) => (
                  <SelectItem key={cad} value={cad}>
                    {cad}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* CAM名 */}
          <div>
            <Label htmlFor="cam-name" className="text-sm font-medium text-gray-900">
              CAM名
            </Label>
            <Select value={filters.camName} onValueChange={(value) => updateFilter("camName", value)}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="CAMを選択" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">すべて</SelectItem>
                {camOptions.map((cam) => (
                  <SelectItem key={cam} value={cam}>
                    {cam}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* 受注個数 */}
          <div>
            <Label htmlFor="order-quantity" className="text-sm font-medium text-gray-900">
              受注個数
            </Label>
            <Input
              id="order-quantity"
              type="number"
              placeholder="受注個数を入力"
              value={filters.orderQuantity}
              onChange={(e) => updateFilter("orderQuantity", e.target.value)}
              className="mt-2"
            />
          </div>

          {/* 受注日 */}
          <div>
            <Label className="text-sm font-medium text-gray-900">受注日</Label>
            <div className="mt-2 flex gap-2 items-center">
              <Input
                type="date"
                value={filters.orderDateFrom}
                onChange={(e) => updateFilter("orderDateFrom", e.target.value)}
                className="text-sm"
              />
              <span className="text-xs text-gray-500">〜</span>
              <Input
                type="date"
                value={filters.orderDateTo}
                onChange={(e) => updateFilter("orderDateTo", e.target.value)}
                className="text-sm"
              />
            </div>
          </div>

          {/* 納品日 */}
          <div>
            <Label className="text-sm font-medium text-gray-900">納品日</Label>
            <div className="mt-2 flex gap-2 items-center">
              <Input
                type="date"
                value={filters.deliveryDateFrom}
                onChange={(e) => updateFilter("deliveryDateFrom", e.target.value)}
                className="text-sm"
              />
              <span className="text-xs text-gray-500">〜</span>
              <Input
                type="date"
                value={filters.deliveryDateTo}
                onChange={(e) => updateFilter("deliveryDateTo", e.target.value)}
                className="text-sm"
              />
            </div>
          </div>

          <Separator />

          {/* 全社項目 */}
          <div>
            <Label htmlFor="company-field" className="text-sm font-medium text-gray-900">
              業界・分野
            </Label>
            <Select value={filters.companyField} onValueChange={(value) => updateFilter("companyField", value)}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="分野を選択" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">すべて</SelectItem>
                {companyFields.map((field) => (
                  <SelectItem key={field} value={field}>
                    {field}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </>
  );
}