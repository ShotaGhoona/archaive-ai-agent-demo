"use client";
import React, { useState } from 'react';
import {
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Calendar,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Button,
} from '@/shared';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { FilterControlProps, DateRangeFilter } from '../model';

/**
 * 個別のフィルターコントロールを表示するコンポーネント
 */
export function FilterControl<T>({ 
  config, 
  value, 
  onChange 
}: FilterControlProps<T>) {
  // All useState hooks must be at the top level
  const [isDateOpen, setIsDateOpen] = useState(false);
  const [isFromOpen, setIsFromOpen] = useState(false);
  const [isToOpen, setIsToOpen] = useState(false);

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
        const selectedDate = value ? new Date(String(value)) : undefined;
        
        return (
          <Popover open={isDateOpen} onOpenChange={setIsDateOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="mt-2 w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, 'yyyy/MM/dd') : '日付を選択'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  if (date) {
                    handleChange(format(date, 'yyyy-MM-dd'));
                  } else {
                    handleChange('');
                  }
                  setIsDateOpen(false);
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        );

      case 'dateRange':
        const dateRange = value as DateRangeFilter || { from: '', to: '' };
        const fromDate = dateRange.from ? new Date(dateRange.from) : undefined;
        const toDate = dateRange.to ? new Date(dateRange.to) : undefined;
        
        return (
          <div className="mt-2 flex gap-2 items-center">
            <Popover open={isFromOpen} onOpenChange={setIsFromOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="flex-1 justify-start text-left font-normal text-sm"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {fromDate ? format(fromDate, 'yyyy/MM/dd') : '開始日'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={fromDate}
                  onSelect={(date) => {
                    if (date) {
                      handleDateRangeChange('from', format(date, 'yyyy-MM-dd'));
                    } else {
                      handleDateRangeChange('from', '');
                    }
                    setIsFromOpen(false);
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <span className="text-xs text-gray-500">〜</span>
            <Popover open={isToOpen} onOpenChange={setIsToOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="flex-1 justify-start text-left font-normal text-sm"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {toDate ? format(toDate, 'yyyy/MM/dd') : '終了日'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={toDate}
                  onSelect={(date) => {
                    if (date) {
                      handleDateRangeChange('to', format(date, 'yyyy-MM-dd'));
                    } else {
                      handleDateRangeChange('to', '');
                    }
                    setIsToOpen(false);
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
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