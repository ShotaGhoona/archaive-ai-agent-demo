'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger, cn } from '@/shared';
import { settingSections } from '../constants';

export function SettingSidebar() {
  const pathname = usePathname();
  const [expandedSections, setExpandedSections] = useState<string[]>(
    settingSections.map((section) => section.id), // デフォルトで全て展開
  );

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId],
    );
  };

  return (
    <aside className='flex h-[calc(100vh-60px)] w-[250px] flex-col border-r border-gray-200 bg-gray-50 dark:bg-gray-900'>
      {/* ナビゲーション */}
      <nav className='scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent flex-1 overflow-y-auto py-4'>
        {settingSections.map((section) => (
          <div key={section.id} className='mb-2'>
            {/* セクションヘッダー */}
            <button
              onClick={() => toggleSection(section.id)}
              className='flex w-full items-center justify-between px-6 py-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800'
            >
              <span className='text-sm font-bold text-gray-700 dark:text-gray-300'>
                {section.title}
              </span>
              <ChevronDown
                className={cn(
                  'h-4 w-4 text-gray-400 transition-transform duration-200',
                  expandedSections.includes(section.id)
                    ? 'rotate-0'
                    : '-rotate-90',
                )}
              />
            </button>

            {/* セクションアイテム */}
            {expandedSections.includes(section.id) && (
              <div className='mt-1 mb-3'>
                {section.items.map((item) => {
                  const isActive = pathname === item.href;

                  return (
                    <Tooltip key={item.id} delayDuration={500}>
                      <TooltipTrigger asChild>
                        <Link
                          href={item.href}
                          className={cn(
                            'relative flex items-center gap-3 px-6 py-2 text-sm transition-colors',
                            'hover:bg-gray-100 dark:hover:bg-gray-800',
                            isActive && 'bg-primary/10 text-primary',
                            !isActive &&
                              'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200',
                          )}
                        >
                          {/* アクティブインジケーター */}
                          {isActive && (
                            <div className='bg-primary absolute top-0 bottom-0 left-0 w-1' />
                          )}

                          <div
                            className={cn(
                              'flex-shrink-0',
                              isActive
                                ? 'text-primary'
                                : 'text-gray-400 dark:text-gray-500',
                            )}
                          >
                            {item.icon}
                          </div>
                          <span className='flex-1'>{item.label}</span>
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent side='right'>
                        <p>{item.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>
            )}

            {/* セクション間の区切り線 */}
            {section.id !== settingSections[settingSections.length - 1].id && (
              <div className='mx-6 border-b border-gray-200 dark:border-gray-800' />
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}
