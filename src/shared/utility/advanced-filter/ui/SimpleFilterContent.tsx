import React from 'react';
import { Separator } from '@/shared';
import { FilterControl } from '../ui';
import { FilterConfig, FilterState } from '../model';

interface SimpleFilterContentProps<T> {
  config: FilterConfig<T>[];
  filters: FilterState<T>;
  updateFilter: (key: string, value: unknown) => void;
}

export function SimpleFilterContent<T>({
  config,
  filters,
  updateFilter,
}: SimpleFilterContentProps<T>) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {config.map((filterConfig, index) => (
        <React.Fragment key={filterConfig.key as string}>
          <FilterControl
            config={filterConfig}
            value={filters[filterConfig.key as string]}
            onChange={(value) => updateFilter(filterConfig.key as string, value)}
          />
          
          {/* セパレーターを適切な位置に挿入 */}
          {index < config.length - 1 && 
           index % 3 === 2 && (
            <Separator />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}