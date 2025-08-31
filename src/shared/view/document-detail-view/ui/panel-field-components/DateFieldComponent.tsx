import React, { useState } from 'react';
import { Calendar, Popover, PopoverContent, PopoverTrigger, Button, Label } from '@/shared';
import { DocumentPanelColumn } from '../../model';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

interface DateFieldComponentProps<T> {
  item: T;
  column: DocumentPanelColumn<T>;
  value: unknown;
  onChange: (value: string) => void;
}

export function DateFieldComponent<T>({
  column,
  value,
  onChange,
}: DateFieldComponentProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  
  const currentDate = value ? new Date(String(value)) : undefined;

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      onChange(date.toISOString());
    } else {
      onChange('');
    }
    setIsOpen(false);
  };

  if (!column.editable) {
    return (
      <div className='space-y-2'>
        <Label>{column.label}</Label>
        <div className='w-full px-3 py-2 text-sm border border-gray-200 rounded-md bg-gray-50 text-gray-600'>
          {currentDate 
            ? format(currentDate, 'yyyy年MM月dd日', { locale: ja })
            : '未設定'
          }
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-2'>
      <Label>{column.label}</Label>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start text-left font-normal"
            onClick={() => setIsOpen(true)}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {currentDate 
              ? format(currentDate, 'yyyy年MM月dd日', { locale: ja }) 
              : (column.placeholder || '日付を選択')
            }
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={currentDate}
            onSelect={handleDateSelect}
            initialFocus
            locale={ja}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
