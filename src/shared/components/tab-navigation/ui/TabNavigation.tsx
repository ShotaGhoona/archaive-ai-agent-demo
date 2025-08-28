"use client";
import { TabNavigationProps } from '../model/types';

export function TabNavigation({
  items,
  selectedKey,
  onTabChange,
  className = ""
}: TabNavigationProps) {
  return (
    <div className={`bg-gray-100 border-b border-gray-300 px-2 pt-2 ${className}`}>
      <nav className="flex" aria-label="Tabs">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.key}
              onClick={() => onTabChange(item.key)}
              className={`text-sm transition-all flex items-center gap-2 whitespace-nowrap ${
                selectedKey === item.key
                  ? 'bg-white border-t border-l border-r border-gray-300 text-primary -mb-px relative rounded-t-lg px-6 pt-3 pb-1 font-bold'
                  : 'bg-gray-100 text-gray-500 hover:text-gray-700 px-6 py-3 font-medium'
              }`}
            >
              {Icon && <Icon size={16} />}
              {item.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}