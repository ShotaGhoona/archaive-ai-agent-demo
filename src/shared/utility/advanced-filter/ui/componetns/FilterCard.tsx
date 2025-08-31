'use client';
import React from 'react';
import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Label,
} from '@/shared';
import { X } from 'lucide-react';
import { FilterConfig } from '../../model';
import { FilterControl } from './FilterControls';

interface FilterCardData {
  id: string;
  field: string;
  operator: string;
  value: unknown;
  logic: 'AND' | 'OR';
}

interface FilterCardProps<T> {
  card: FilterCardData;
  config: FilterConfig<T>[];
  onUpdate: (card: FilterCardData) => void;
  onRemove: (id: string) => void;
  canRemove: boolean;
}

export function FilterCard<T>({
  card,
  config,
  onUpdate,
  onRemove,
  canRemove,
}: FilterCardProps<T>) {
  const selectedConfig = config.find((c) => c.key === card.field);

  const getOperators = (type: string) => {
    switch (type) {
      case 'text':
        return [
          { value: 'contains', label: '含む' },
          { value: 'equals', label: '一致する' },
          { value: 'startsWith', label: '始まる' },
          { value: 'endsWith', label: '終わる' },
        ];
      case 'number':
        return [
          { value: 'equals', label: '等しい' },
          { value: 'greater', label: 'より大きい' },
          { value: 'less', label: 'より小さい' },
          { value: 'greaterEqual', label: '以上' },
          { value: 'lessEqual', label: '以下' },
        ];
      case 'select':
        return [
          { value: 'equals', label: '等しい' },
          { value: 'notEquals', label: '等しくない' },
        ];
      case 'date':
      case 'dateRange':
        return [
          { value: 'equals', label: '等しい' },
          { value: 'after', label: 'より後' },
          { value: 'before', label: 'より前' },
          { value: 'between', label: '範囲内' },
        ];
      default:
        return [{ value: 'equals', label: '等しい' }];
    }
  };

  const operators = selectedConfig ? getOperators(selectedConfig.type) : [];

  const updateField = (field: string) => {
    onUpdate({
      ...card,
      field,
      operator: '', // フィールド変更時はリセット
      value: '',
    });
  };

  const updateOperator = (operator: string) => {
    onUpdate({
      ...card,
      operator,
      value: '', // オペレーター変更時は値をリセット
    });
  };

  const updateValue = (value: unknown) => {
    onUpdate({ ...card, value });
  };

  return (
    <div className='relative space-y-4 rounded-lg border border-gray-200 bg-white p-4'>
      <div className='absolute top-2 right-2 items-center justify-between'>
        {canRemove && (
          <Button
            variant='ghost'
            size='sm'
            onClick={() => onRemove(card.id)}
            className='h-6 w-6 p-0 text-gray-400 hover:text-red-500'
          >
            <X className='h-4 w-4' />
          </Button>
        )}
      </div>

      {/* フィールド選択 */}
      <div>
        <Label className='mb-2 text-xs font-medium text-gray-600'>対象</Label>
        <Select value={card.field} onValueChange={updateField}>
          <SelectTrigger className='w-full'>
            <SelectValue placeholder='何を検索しますか？' />
          </SelectTrigger>
          <SelectContent>
            {config.map((field) => (
              <SelectItem key={field.key as string} value={field.key as string}>
                {field.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* フィールドが選択されたら条件と値の入力欄を表示 */}
      {selectedConfig && (
        <div className='space-y-4'>
          {/* 条件選択 */}
          <div className='flex items-center justify-between'>
            <label className='mb-2 text-xs font-medium text-gray-600'>
              条件
            </label>
            <Select value={card.operator} onValueChange={updateOperator}>
              <SelectTrigger>
                <SelectValue placeholder='条件を選択' />
              </SelectTrigger>
              <SelectContent>
                {operators.map((op) => (
                  <SelectItem key={op.value} value={op.value}>
                    {op.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 値入力 */}
          <div>
            <FilterControl
              config={selectedConfig}
              value={card.value}
              onChange={updateValue}
            />
          </div>
        </div>
      )}
    </div>
  );
}
