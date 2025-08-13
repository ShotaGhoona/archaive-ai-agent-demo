import React from 'react';
import {
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/shadcnui';
import { FilterControlProps, DateRangeFilter } from '../model/types';

/**
 * 個別のフィルターコントロールを表示するコンポーネント
 */
export function FilterControl<T>({ 
  config, 
  value, 
  onChange 
}: FilterControlProps<T>) {
  const handleChange = (newValue: unknown) => {
    onChange(newValue);
  };

  const handleDateRangeChange = (field: 'from' | 'to', newValue: string) => {
    const currentValue = value as DateRangeFilter || { from: '', to: '' };
    onChange({
      ...currentValue,
      [field]: newValue,
    });
  };

  const renderControl = () => {
    switch (config.type) {
      case 'text':
        return (
          <Input
            placeholder={config.placeholder}
            value={String(value || '')}
            onChange={(e) => handleChange(e.target.value)}
            className="mt-2"
          />
        );

      case 'number':
        return (
          <Input
            type="number"
            placeholder={config.placeholder}
            value={String(value || '')}
            onChange={(e) => handleChange(e.target.value)}
            className="mt-2"
          />
        );

      case 'select':
        return (
          <Select value={String(value || 'all')} onValueChange={handleChange}>
            <SelectTrigger className="mt-2 w-full">
              <SelectValue placeholder={config.placeholder} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">すべて</SelectItem>
              {config.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'date':
        return (
          <Input
            type="date"
            value={String(value || '')}
            onChange={(e) => handleChange(e.target.value)}
            className="mt-2 text-sm"
          />
        );

      case 'dateRange':
        const dateRange = value as DateRangeFilter || { from: '', to: '' };
        return (
          <div className="mt-2 flex gap-2 items-center">
            <Input
              type="date"
              value={dateRange.from || ''}
              onChange={(e) => handleDateRangeChange('from', e.target.value)}
              className="text-sm"
            />
            <span className="text-xs text-gray-500">〜</span>
            <Input
              type="date"
              value={dateRange.to || ''}
              onChange={(e) => handleDateRangeChange('to', e.target.value)}
              className="text-sm"
            />
          </div>
        );

      case 'datetime-local':
        const dateTimeRange = value as DateRangeFilter || { from: '', to: '' };
        return (
          <div className="mt-2 flex gap-2 items-center">
            <Input
              type="datetime-local"
              value={dateTimeRange.from || ''}
              onChange={(e) => handleDateRangeChange('from', e.target.value)}
              className="text-sm"
            />
            <span className="text-xs text-gray-500">〜</span>
            <Input
              type="datetime-local"
              value={dateTimeRange.to || ''}
              onChange={(e) => handleDateRangeChange('to', e.target.value)}
              className="text-sm"
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div>
      <Label className="text-sm font-medium text-gray-900">
        {config.label}
      </Label>
      {renderControl()}
    </div>
  );
}