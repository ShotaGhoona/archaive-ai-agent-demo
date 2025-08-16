"use client";

import React from 'react';
import { V2Sidebar } from '../../widgets/v2-sidebar/ui/sidebar';

export default function V2Page() {

  return (
    <div className="h-[calc(100vh-45px)] flex">
      {/* Sidebar */}
      <V2Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Content Area */}
        <div className="flex-1 p-6 bg-gray-50">
          <div className="h-full bg-white rounded-lg border flex items-center justify-center">
            <div className="text-center text-gray-500">
              <h2 className="text-lg font-medium mb-2">コンテンツエリア</h2>
              <p className="text-sm">
                サイドバーからアイテムを選択すると、ここにコンテンツが表示されます。
              </p>
              <div className="mt-4 text-xs text-gray-400">
                <p>・ フォルダやページを自由に追加できます</p>
                <p>・ 階層構造を企業に合わせてカスタマイズ可能</p>
                <p>・ macOS Finderのような直感的な操作</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}