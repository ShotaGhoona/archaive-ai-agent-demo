'use client';

import { useState } from 'react';
import { PageHeader, ColumnDefineArea } from '../ui';
import { ColumnConfig, DatabaseColumnSettingProps } from '../model';

export default function DatabaseColumnSettingContainer({
  defaultColumns,
  databaseType,
  pageTitle,
}: DatabaseColumnSettingProps) {
  const [columns, setColumns] = useState<ColumnConfig[]>(defaultColumns);

  // 列設定の更新
  const handleUpdateColumn = (id: string, updates: Partial<ColumnConfig>) => {
    setColumns(prev => prev.map(col => 
      col.id === id ? { ...col, ...updates } : col
    ));
  };

  // 列の削除
  const handleDeleteColumn = (id: string) => {
    setColumns(prev => prev.filter(col => col.id !== id));
  };

  // 新規列の追加
  const handleAddColumn = () => {
    const maxOrder = Math.max(...columns.map(col => col.order), 0);
    const newColumn: ColumnConfig = {
      id: `custom-${Date.now()}`,
      name: '新しい項目',
      displayEnabled: true,
      filterEnabled: false,
      dataType: 'text',
      order: maxOrder + 1,
    };
    
    setColumns(prev => [...prev, newColumn]);
  };

  // 列の順序変更
  const handleReorderColumns = (startIndex: number, endIndex: number) => {
    const sortedColumns = [...columns].sort((a, b) => a.order - b.order);
    const [removed] = sortedColumns.splice(startIndex, 1);
    sortedColumns.splice(endIndex, 0, removed);
    
    // order値を再計算
    const reorderedColumns = sortedColumns.map((col, index) => ({
      ...col,
      order: index + 1,
    }));
    
    setColumns(reorderedColumns);
  };

  // 設定の保存
  const handleSave = () => {
    // TODO: 実際の保存処理（localStorage / API等）
    console.log(`${databaseType}データベース設定を保存:`, columns);
    alert(`${pageTitle}を保存しました`);
  };

  return (
    <div className="h-[calc(100vh-45px)] flex flex-col overflow-hidden">
      {/* ページヘッダー */}
      <div className="flex-shrink-0 p-4">
        <PageHeader 
          onSave={handleSave}
        />
      </div>
      
      {/* メインコンテンツエリア */}
      <div className="flex-1 flex flex-col min-h-0 px-4 pb-4">
        {/* 項目設定エリア */}
        <div className="flex-1 min-h-0">
          <ColumnDefineArea
            columns={columns}
            onUpdateColumn={handleUpdateColumn}
            onDeleteColumn={handleDeleteColumn}
            onAddColumn={handleAddColumn}
            onReorderColumns={handleReorderColumns}
          />
        </div>
      </div>
    </div>
  );
}