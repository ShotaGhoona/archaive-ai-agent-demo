// ダミー実装です。見た目だけ作ってます

'use client';
import React, { useState } from 'react';
import { Button } from '@/shared';
import { Plus } from 'lucide-react';
import { FilterConfig, FilterState } from '../model';
import { FilterCard, LogicSwitch } from '../ui';

interface FilterCardData {
  id: string;
  field: string;
  operator: string;
  value: unknown;
  logic: 'AND' | 'OR';
}

interface AdvancedFilterContentProps<T> {
  config: FilterConfig<T>[];
  filters: FilterState<T>;
  updateFilter: (key: string, value: unknown) => void;
}

export function AdvancedFilterContent<T>({
  config,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  filters: _filters,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  updateFilter: _updateFilter,
}: AdvancedFilterContentProps<T>) {
  const [cards, setCards] = useState<FilterCardData[]>([
    {
      id: 'card_1',
      field: '',
      operator: '',
      value: '',
      logic: 'AND',
    },
  ]);

  const addCard = () => {
    const newCard: FilterCardData = {
      id: `card_${Date.now()}`,
      field: '',
      operator: '',
      value: '',
      logic: 'AND',
    };
    setCards([...cards, newCard]);
  };

  const updateCard = (updatedCard: FilterCardData) => {
    setCards(cards.map((c) => (c.id === updatedCard.id ? updatedCard : c)));
  };

  const removeCard = (cardId: string) => {
    setCards(cards.filter((c) => c.id !== cardId));
  };

  const updateLogic = (cardId: string, logic: 'AND' | 'OR') => {
    setCards(cards.map((c) => (c.id === cardId ? { ...c, logic } : c)));
  };

  return (
    <div className='h-full space-y-4 overflow-y-auto p-4'>
      <div>
        <div className='space-y-2'>
          {cards.map((card, index) => (
            <div key={card.id}>
              <FilterCard
                card={card}
                config={config}
                onUpdate={updateCard}
                onRemove={removeCard}
                canRemove={cards.length > 1}
              />

              {/* 最後のカード以外にロジックスイッチを表示 */}
              {index < cards.length - 1 && (
                <LogicSwitch
                  logic={card.logic}
                  onToggle={(logic: 'AND' | 'OR') =>
                    updateLogic(card.id, logic)
                  }
                />
              )}
            </div>
          ))}
        </div>

        <div className='mt-6 text-center'>
          <Button variant='outline' onClick={addCard} className='text-sm'>
            <Plus className='mr-2 h-4 w-4' />
            条件を追加
          </Button>
        </div>
      </div>
    </div>
  );
}
