'use client';
import React, { useState } from 'react';
import { Calendar, Popover, PopoverContent, PopoverTrigger, Button } from '@/shared';
import { DataTableColumn, CellContentData } from '../../model';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

interface DateTypeCellProps<T> {
  item: T;
  column: DataTableColumn<T>;
  cellContent: CellContentData;
  onCellClick: (item: T, field: string) => void;
}

export function DateTypeCell<T>({
  item,
  column,
  cellContent,
  onCellClick,
}: DateTypeCellProps<T>) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  if (cellContent.isEditing) {
    const currentDate = cellContent.value ? new Date(String(cellContent.value)) : undefined;
    
    return (
      <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full h-8 justify-start text-left font-normal bg-transparent border-0 focus:ring-1 focus:ring-primary p-1"
            onClick={() => setIsCalendarOpen(true)}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {currentDate ? format(currentDate, 'yyyy年MM月dd日', { locale: ja }) : '日付を選択'}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={currentDate}
            onSelect={(date) => {
              if (date) {
                cellContent.onChange!(date.toISOString());
                cellContent.onSave!();
                setIsCalendarOpen(false);
              }
            }}
            initialFocus
            locale={ja}
          />
        </PopoverContent>
      </Popover>
    );
  }

  const renderDateDisplay = () => {
    if (!cellContent.value) {
      return <span className='text-gray-400'>未設定</span>;
    }

    const date = new Date(String(cellContent.value));
    const now = new Date();
    const diffInDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (diffInDays === 0) {
      return (
        <span className='text-blue-600'>
          今日
        </span>
      );
    }

    if (diffInDays > 0 && diffInDays <= 6) {
      return (
        <span className='text-orange-600'>
          {diffInDays}日前
        </span>
      );
    }

    return (
      <span className='text-gray-600'>
        {date.toLocaleDateString('ja-JP', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })}
      </span>
    );
  };

  return (
    <div
      className={
        column.editable && !column.locked ? 'cursor-pointer' : undefined
      }
      onClick={
        column.editable && !column.locked
          ? () => onCellClick(item, column.key as string)
          : undefined
      }
    >
      {renderDateDisplay()}
    </div>
  );
}
