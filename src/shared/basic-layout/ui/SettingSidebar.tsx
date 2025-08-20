"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { HelpCircle, ChevronDown } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { settingSections, appInfo } from "../constants/settings-sidebar";

export default function SettingSidebar() {
  const pathname = usePathname();
  const [expandedSections, setExpandedSections] = useState<string[]>(
    settingSections.map(section => section.id) // デフォルトで全て展開
  );

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  return (
    <aside className="w-[250px] bg-gray-50 dark:bg-gray-900 h-[calc(100vh-45px)] flex flex-col border-r border-gray-200">
      {/* ナビゲーション */}
      <nav className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent">
        {settingSections.map((section) => (
          <div key={section.id} className="mb-2">
            {/* セクションヘッダー */}
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full px-6 py-2 flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="flex items-center gap-2">
                <div className="text-gray-500 dark:text-gray-400">
                  {section.icon}
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {section.title}
                </span>
              </div>
              <ChevronDown
                className={cn(
                  "w-4 h-4 text-gray-400 transition-transform duration-200",
                  expandedSections.includes(section.id) ? "rotate-0" : "-rotate-90"
                )}
              />
            </button>

            {/* セクションアイテム */}
            {expandedSections.includes(section.id) && (
              <div className="mt-1 mb-3">
                {section.items.map((item) => {
                  const isActive = pathname === item.href;
                  
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-6 py-2 text-sm transition-colors relative",
                        "hover:bg-gray-100 dark:hover:bg-gray-800",
                        isActive && "bg-primary/10 text-primary",
                        !isActive && "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                      )}
                    >
                      {/* アクティブインジケーター */}
                      {isActive && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
                      )}
                      
                      <div className={cn(
                        "flex-shrink-0",
                        isActive ? "text-primary" : "text-gray-400 dark:text-gray-500"
                      )}>
                        {item.icon}
                      </div>
                      <span className="flex-1">
                        {item.label}
                      </span>
                    </Link>
                  );
                })}
              </div>
            )}

            {/* セクション間の区切り線 */}
            {section.id !== settingSections[settingSections.length - 1].id && (
              <div className="mx-6 border-b border-gray-200 dark:border-gray-800" />
            )}
          </div>
        ))}
      </nav>

      {/* フッター */}
      <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800 flex-shrink-0">
        <Link
          href="/setting/help"
          className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
        >
          <HelpCircle className="w-4 h-4" />
          <span>ヘルプ & サポート</span>
        </Link>
        <div className="mt-3 text-xs text-gray-500 dark:text-gray-500">
          Version {appInfo.version}
        </div>
      </div>
    </aside>
  );
}