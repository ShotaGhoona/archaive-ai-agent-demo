'use client';

import { useState } from 'react';
import { Button, Input } from '@/shared';
import { Save, PenTool } from 'lucide-react';
import { DatabaseColumnSetting } from '@/widgets';
import { DatabaseColumnSettingConfig } from '@/widgets';
import { DEFAULT_BLUEPRINT_TABLES, BlueprintDatabaseService, BlueprintTable, BlueprintDatabaseState } from '../lib';

export function BlueprintDatabaseSettingContainer() {
  // データベース状態の管理
  const [state, setState] = useState<BlueprintDatabaseState>(() => {
    const allColumns: Record<string, DatabaseColumnSettingConfig[]> = {};
    
    DEFAULT_BLUEPRINT_TABLES.forEach(table => {
      allColumns[table.id] = table.defaultColumns;
    });

    return {
      blueprintTables: DEFAULT_BLUEPRINT_TABLES,
      blueprintColumns: allColumns,
    };
  });

  // 列設定の更新
  const handleUpdateColumn = (tableId: string, columnId: string, updates: Partial<DatabaseColumnSettingConfig>) => {
    setState(prev => BlueprintDatabaseService.updateColumn(prev, tableId, columnId, updates));
  };

  // 列の削除
  const handleDeleteColumn = (tableId: string, columnId: string) => {
    setState(prev => BlueprintDatabaseService.deleteColumn(prev, tableId, columnId));
  };

  // 新規列の追加
  const handleAddColumn = (tableId: string) => {
    setState(prev => BlueprintDatabaseService.addColumn(prev, tableId));
  };

  // 設定の保存
  const handleSave = () => {
    // TODO: 実際の保存処理（localStorage / API等）
    console.log('図面データベース設定を保存:', state);
    alert('図面データベース設定を保存しました');
  };

  return (
    <div className="flex flex-col">
      {/* ページヘッダー */}
      <div className="p-4">
        <div className="flex items-center justify-between space-x-4">
          <div className="flex items-center gap-4">
          </div>
          
          <div className="flex items-center space-x-2">
            <Button onClick={handleSave} size="lg" className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              図面設定を保存
            </Button>
          </div>
        </div>
      </div>

      {/* テーブル設定エリア */}
      <div className="px-4 pb-4 space-y-8">
        {state.blueprintTables.map(table => (
          <div key={table.id} className="space-y-4">
            {/* テーブルヘッダー */}
            <div className="flex items-center gap-3">
              <PenTool className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-semibold text-primary">{table.name}</h2>
            </div>
            
            {/* 各テーブルの項目設定 */}
            <DatabaseColumnSetting
              columns={state.blueprintColumns[table.id] || []}
              onUpdateColumn={(columnId, updates) => handleUpdateColumn(table.id, columnId, updates)}
              onDeleteColumn={(columnId) => handleDeleteColumn(table.id, columnId)}
              onAddColumn={() => handleAddColumn(table.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}