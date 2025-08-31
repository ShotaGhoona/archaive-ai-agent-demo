'use client';
import Link from 'next/link';
import { LinkTabNavigationProps } from '../model/types';

export function LinkTabNavigation({
  items,
  selectedKey,
  className = '',
}: LinkTabNavigationProps) {
  return (
    <div
      className={`border-b border-gray-300 bg-gray-100 px-4 pt-2 ${className}`}
    >
      <nav className='flex' aria-label='Tabs'>
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.key}
              href={item.href}
              className={`flex items-center gap-2 text-sm transition-all ${
                selectedKey === item.key
                  ? 'text-primary relative -mb-px rounded-t-lg border-t border-r border-l border-gray-300 bg-white px-6 pt-3 pb-1 font-bold'
                  : 'bg-gray-100 px-6 py-3 font-medium text-gray-500 hover:text-gray-700'
              }`}
            >
              {Icon && <Icon size={16} />}
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
