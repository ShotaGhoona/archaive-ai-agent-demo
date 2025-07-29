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
} from "@/shared/shadcnui";
import { ChevronLeft, RotateCcw } from "lucide-react";

interface ProjectFilterSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  filters: {
    projectId: string;
    customerName: string;
    assignee: string;
    responseDeadlineFrom: string;
    responseDeadlineTo: string;
    workCompleteDateFrom: string;
    workCompleteDateTo: string;
    deliveryDeadlineFrom: string;
    deliveryDeadlineTo: string;
    receiptDateFrom: string;
    receiptDateTo: string;
    projectStatus: string;
    quotationStatus: string;
    deliveryStatus: string;
    lastUpdatedBy: string;
    lastUpdatedAtFrom: string;
    lastUpdatedAtTo: string;
  };
  onFiltersChange: (filters: any) => void;
  onClearFilters: () => void;
}

export function ProjectFilterSidebar({
  isOpen,
  onToggle,
  filters,
  onFiltersChange,
  onClearFilters,
}: ProjectFilterSidebarProps) {
  const projectStatusOptions = ["問い合わせ", "見積もり中", "納品"];
  const quotationStatusOptions = ["未提出", "作成中", "提出済"];
  const deliveryStatusOptions = ["未対応", "配送準備中", "配送中", "配送完了"];

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
          {/* 案件ID */}
          <div>
            <Label htmlFor="project-id" className="text-sm font-medium text-gray-900">
              案件ID
            </Label>
            <Input
              id="project-id"
              placeholder="案件IDを入力"
              value={filters.projectId}
              onChange={(e) => updateFilter("projectId", e.target.value)}
              className="mt-2"
            />
          </div>

          {/* 顧客名 */}
          <div>
            <Label htmlFor="customer-name" className="text-sm font-medium text-gray-900">
              顧客名
            </Label>
            <Input
              id="customer-name"
              placeholder="顧客名を入力"
              value={filters.customerName}
              onChange={(e) => updateFilter("customerName", e.target.value)}
              className="mt-2"
            />
          </div>

          {/* 担当者 */}
          <div>
            <Label htmlFor="assignee" className="text-sm font-medium text-gray-900">
              担当者
            </Label>
            <Input
              id="assignee"
              placeholder="担当者を入力"
              value={filters.assignee}
              onChange={(e) => updateFilter("assignee", e.target.value)}
              className="mt-2"
            />
          </div>

          <Separator />

          {/* 回答期日 */}
          <div>
            <Label className="text-sm font-medium text-gray-900">回答期日</Label>
            <div className="mt-2 flex gap-2 items-center">
              <Input
                type="date"
                value={filters.responseDeadlineFrom}
                onChange={(e) => updateFilter("responseDeadlineFrom", e.target.value)}
                className="text-sm"
              />
              <span className="text-xs text-gray-500">〜</span>
              <Input
                type="date"
                value={filters.responseDeadlineTo}
                onChange={(e) => updateFilter("responseDeadlineTo", e.target.value)}
                className="text-sm"
              />
            </div>
          </div>

          {/* 作業完了日 */}
          <div>
            <Label className="text-sm font-medium text-gray-900">作業完了日</Label>
            <div className="mt-2 flex gap-2 items-center">
              <Input
                type="date"
                value={filters.workCompleteDateFrom}
                onChange={(e) => updateFilter("workCompleteDateFrom", e.target.value)}
                className="text-sm"
              />
              <span className="text-xs text-gray-500">〜</span>
              <Input
                type="date"
                value={filters.workCompleteDateTo}
                onChange={(e) => updateFilter("workCompleteDateTo", e.target.value)}
                className="text-sm"
              />
            </div>
          </div>

          {/* 納品期日 */}
          <div>
            <Label className="text-sm font-medium text-gray-900">納品期日</Label>
            <div className="mt-2 flex gap-2 items-center">
              <Input
                type="date"
                value={filters.deliveryDeadlineFrom}
                onChange={(e) => updateFilter("deliveryDeadlineFrom", e.target.value)}
                className="text-sm"
              />
              <span className="text-xs text-gray-500">〜</span>
              <Input
                type="date"
                value={filters.deliveryDeadlineTo}
                onChange={(e) => updateFilter("deliveryDeadlineTo", e.target.value)}
                className="text-sm"
              />
            </div>
          </div>

          {/* 入荷期日 */}
          <div>
            <Label className="text-sm font-medium text-gray-900">入荷期日</Label>
            <div className="mt-2 flex gap-2 items-center">
              <Input
                type="date"
                value={filters.receiptDateFrom}
                onChange={(e) => updateFilter("receiptDateFrom", e.target.value)}
                className="text-sm"
              />
              <span className="text-xs text-gray-500">〜</span>
              <Input
                type="date"
                value={filters.receiptDateTo}
                onChange={(e) => updateFilter("receiptDateTo", e.target.value)}
                className="text-sm"
              />
            </div>
          </div>

          <Separator />

          {/* 案件状況 */}
          <div>
            <Label htmlFor="project-status" className="text-sm font-medium text-gray-900">
              案件状況
            </Label>
            <Select value={filters.projectStatus} onValueChange={(value) => updateFilter("projectStatus", value)}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="案件状況を選択" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">すべて</SelectItem>
                {projectStatusOptions.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 見積書ステータス */}
          <div>
            <Label htmlFor="quotation-status" className="text-sm font-medium text-gray-900">
              見積書ステータス
            </Label>
            <Select value={filters.quotationStatus} onValueChange={(value) => updateFilter("quotationStatus", value)}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="見積書ステータスを選択" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">すべて</SelectItem>
                {quotationStatusOptions.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 納品書ステータス */}
          <div>
            <Label htmlFor="delivery-status" className="text-sm font-medium text-gray-900">
              納品書ステータス
            </Label>
            <Select value={filters.deliveryStatus} onValueChange={(value) => updateFilter("deliveryStatus", value)}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="納品書ステータスを選択" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">すべて</SelectItem>
                {deliveryStatusOptions.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* 最終更新者 */}
          <div>
            <Label htmlFor="last-updated-by" className="text-sm font-medium text-gray-900">
              最終更新者
            </Label>
            <Input
              id="last-updated-by"
              placeholder="最終更新者を入力"
              value={filters.lastUpdatedBy}
              onChange={(e) => updateFilter("lastUpdatedBy", e.target.value)}
              className="mt-2"
            />
          </div>

          {/* 最終更新日時 */}
          <div>
            <Label className="text-sm font-medium text-gray-900">最終更新日時</Label>
            <div className="mt-2 flex gap-2 items-center">
              <Input
                type="datetime-local"
                value={filters.lastUpdatedAtFrom}
                onChange={(e) => updateFilter("lastUpdatedAtFrom", e.target.value)}
                className="text-sm"
              />
              <span className="text-xs text-gray-500">〜</span>
              <Input
                type="datetime-local"
                value={filters.lastUpdatedAtTo}
                onChange={(e) => updateFilter("lastUpdatedAtTo", e.target.value)}
                className="text-sm"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}