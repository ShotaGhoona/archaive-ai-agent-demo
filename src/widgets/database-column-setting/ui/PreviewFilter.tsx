'use client';

import { 
  Button, 
  Sheet, 
  SheetContent, 
  SheetTrigger,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator
} from '@/shared/shadcnui';
import { Filter, Calendar, RotateCcw } from 'lucide-react';
import { ColumnConfig, SelectOption } from '../model/types';
import React, { useState } from 'react';

interface PreviewFilterProps {
  columns: ColumnConfig[];
}

interface FilterState {
  [key: string]: unknown;
}

interface DateRangeFilter {
  from?: string;
  to?: string;
}

export function PreviewFilter({ columns }: PreviewFilterProps) {
  // フィルター対象の列のみ取得
  const filterColumns = columns
    .filter(col => col.filterEnabled)
    .sort((a, b) => a.order - b.order);

  // フィルター状態の管理
  const [filters, setFilters] = useState<FilterState>({});

  const updateFilter = (key: string, value: unknown) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleDateRangeChange = (columnId: string, field: 'from' | 'to', newValue: string) => {
    const currentValue = filters[columnId] as DateRangeFilter || { from: '', to: '' };
    updateFilter(columnId, {
      ...currentValue,
      [field]: newValue,
    });
  };

  const clearFilters = () => {
    setFilters({});
  };

  const renderFilterControl = (column: ColumnConfig) => {
    const value = filters[column.id];

    switch (column.dataType) {
      case 'text':
        return (
          <Input
            placeholder={`${column.name}で検索...`}
            value={String(value || '')}
            onChange={(e) => updateFilter(column.id, e.target.value)}
            className="mt-2"
          />
        );

      case 'number':
        return (
          <Input
            type="number"
            placeholder={`${column.name}を入力...`}
            value={String(value || '')}
            onChange={(e) => updateFilter(column.id, e.target.value)}
            className="mt-2"
          />
        );

      case 'select':
        const selectOptions = column.options || [];
        return (
          <Select 
            value={String(value || 'all')} 
            onValueChange={(newValue) => updateFilter(column.id, newValue)}
          >
            <SelectTrigger className="mt-2 w-full">
              <SelectValue placeholder={`${column.name}を選択...`} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">すべて</SelectItem>
              {selectOptions.length === 0 ? (
                <SelectItem value="" disabled>
                  選択肢が設定されていません
                </SelectItem>
              ) : (
                selectOptions.map((option) => (
                  <SelectItem key={option.id} value={option.label}>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full border border-gray-300"
                        style={{ backgroundColor: option.color }}
                      />
                      {option.label}
                    </div>
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        );

      case 'user':
        const sampleEmployees = ['山田太郎', '佐藤花子', '田中一郎', '鈴木美咲', '高橋健太'];
        return (
          <Select 
            value={String(value || 'all')} 
            onValueChange={(newValue) => updateFilter(column.id, newValue)}
          >
            <SelectTrigger className="mt-2 w-full">
              <SelectValue placeholder={`${column.name}を選択...`} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">すべて</SelectItem>
              {sampleEmployees.map((employee) => (
                <SelectItem key={employee} value={employee}>
                  {employee}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'boolean':
        return (
          <Select 
            value={String(value || 'all')} 
            onValueChange={(newValue) => updateFilter(column.id, newValue)}
          >
            <SelectTrigger className="mt-2 w-full">
              <SelectValue placeholder={`${column.name}を選択...`} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">すべて</SelectItem>
              <SelectItem value="true">ON</SelectItem>
              <SelectItem value="false">OFF</SelectItem>
            </SelectContent>
          </Select>
        );

      case 'date':
        const dateRange = value as DateRangeFilter || { from: '', to: '' };
        return (
          <div className="mt-2 flex gap-2 items-center">
            <div className="relative flex-1">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                type="date" 
                value={dateRange.from || ''}
                onChange={(e) => handleDateRangeChange(column.id, 'from', e.target.value)}
                className="pl-10 text-sm"
              />
            </div>
            <span className="text-xs text-gray-500">〜</span>
            <div className="relative flex-1">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                type="date" 
                value={dateRange.to || ''}
                onChange={(e) => handleDateRangeChange(column.id, 'to', e.target.value)}
                className="pl-10 text-sm"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="lg" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          フィルタープレビュー
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="p-5">
        {filterColumns.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <Filter className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p className="text-sm font-medium">フィルター項目がありません</p>
              <p className="text-xs mt-1">
                項目設定で「フィルターに表示」を有効にしてください
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* ヘッダーにクリアボタンを追加 */}
            <div className="flex items-center justify-between mt-4 mb-6">
              <h2 className="text-lg font-bold text-gray-900">
                詳細フィルター
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="text-xs"
              >
                <RotateCcw className="h-3 w-3 mr-1" />
                クリア
              </Button>
            </div>

            {/* フィルター内容 */}
            <div className="flex-1 overflow-y-auto space-y-4">
              {filterColumns.map((column, index) => (
                <React.Fragment key={column.id}>
                  <div>
                    <Label className="text-sm font-medium text-gray-900">
                      {column.name}
                    </Label>
                    {renderFilterControl(column)}
                  </div>
                  
                  {/* セパレーターを適切な位置に挿入 */}
                  {index < filterColumns.length - 1 && 
                   index % 3 === 2 && (
                    <Separator />
                  )}
                </React.Fragment>
              ))}
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}