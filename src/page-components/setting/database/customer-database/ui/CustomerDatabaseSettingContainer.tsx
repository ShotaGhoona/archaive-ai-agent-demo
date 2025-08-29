'use client';

import { useState } from 'react';
import { Button } from '@/shared';
import { Save } from 'lucide-react';
import { DatabaseColumnSetting } from '@/widgets';
import { ColumnConfig } from '@/widgets';
import { CUSTOMER_COLUMN_SETTING_CONFIGS } from '../lib';

export function CustomerDatabaseSettingContainer() {
  const [columns, setColumns] = useState<ColumnConfig[]>(CUSTOMER_COLUMN_SETTING_CONFIGS);

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
      name: '',
      description: '',
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
    console.log('customerデータベース設定を保存:', columns);
    alert('顧客データベース設定を保存しました');
  };

  return (
    <div className="flex flex-col">
      {/* ページヘッダー */}
      <div className="p-4">
        <div className="flex items-center justify-between space-x-4">
          <div className="flex items-center space-x-2">
          </div>
          
          <div className="flex items-center space-x-2">
            <Button onClick={handleSave} size="lg" className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              設定を保存
            </Button>
          </div>
        </div>
      </div>
      
      {/* メインコンテンツエリア */}
      <div className="px-4 pb-4">
        {/* 項目設定エリア */}
        <div>
          <DatabaseColumnSetting
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