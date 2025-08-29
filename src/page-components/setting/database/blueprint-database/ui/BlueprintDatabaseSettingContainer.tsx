'use client';

import { useState } from 'react';
import { Button } from '@/shared';
import { Save } from 'lucide-react';
import { DatabaseColumnSetting } from '@/widgets';
import { DatabaseColumnSettingConfig } from '@/widgets';
import { BLUEPRINT_COLUMN_SETTING_CONFIGS } from '../lib';

export function BlueprintDatabaseSettingContainer() {
  const [columns, setColumns] = useState<DatabaseColumnSettingConfig[]>(BLUEPRINT_COLUMN_SETTING_CONFIGS);

  // 列設定の更新
  const handleUpdateColumn = (id: string, updates: Partial<DatabaseColumnSettingConfig>) => {
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
    const newColumn: DatabaseColumnSettingConfig = {
      id: `custom-${Date.now()}`,
      name: '',
      description: '',
      dataType: 'text',
    };
    
    setColumns(prev => [...prev, newColumn]);
  };

  // 設定の保存
  const handleSave = () => {
    // TODO: 実際の保存処理（localStorage / API等）
    console.log('blueprintデータベース設定を保存:', columns);
    alert('図面データベース設定を保存しました');
  };

  return (
    <div>
      {/* ページヘッダー */}
      <div className="p-4">
        <div className="flex items-center justify-between space-x-4">
          <div className="flex items-center space-x-2 text-2xl font-bold">
            製品関連データベース設定
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
          />
        </div>
      </div>
    </div>
  );
}