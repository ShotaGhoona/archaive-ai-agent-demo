'use client';

import { useState } from 'react';
import { Button } from '@/shared';
import { Briefcase, Save } from 'lucide-react';
import { DatabaseColumnSetting } from '@/widgets';
import { DatabaseColumnSettingConfig } from '@/widgets';
import {
  DEFAULT_PROJECT_TABLES,
  ProjectDatabaseService,
  ProjectDatabaseState,
} from '../lib';

export function ProjectDatabaseSettingContainer() {
  // データベース状態の管理
  const [state, setState] = useState<ProjectDatabaseState>(() => {
    const allColumns: Record<string, DatabaseColumnSettingConfig[]> = {};

    DEFAULT_PROJECT_TABLES.forEach((table) => {
      allColumns[table.id] = table.defaultColumns;
    });

    return {
      projectTables: DEFAULT_PROJECT_TABLES,
      projectColumns: allColumns,
    };
  });

  // 列設定の更新
  const handleUpdateColumn = (
    tableId: string,
    columnId: string,
    updates: Partial<DatabaseColumnSettingConfig>,
  ) => {
    setState((prev) =>
      ProjectDatabaseService.updateColumn(prev, tableId, columnId, updates),
    );
  };

  // 列の削除
  const handleDeleteColumn = (tableId: string, columnId: string) => {
    setState((prev) =>
      ProjectDatabaseService.deleteColumn(prev, tableId, columnId),
    );
  };

  // 新規列の追加
  const handleAddColumn = (tableId: string) => {
    setState((prev) => ProjectDatabaseService.addColumn(prev, tableId));
  };

  // TODO: 必須フラグ切り替え
  const handleToggleRequired = (tableId: string, columnId: string) => {
    setState((prev) =>
      ProjectDatabaseService.toggleRequired(prev, tableId, columnId),
    );
  };

  // TODO: 基本情報表示切り替え
  const handleToggleBasicInfo = (tableId: string, columnId: string) => {
    setState((prev) =>
      ProjectDatabaseService.toggleBasicInfo(prev, tableId, columnId),
    );
  };

  // TODO: テーブル表示切り替え
  const handleToggleTableDisplay = (tableId: string, columnId: string) => {
    setState((prev) =>
      ProjectDatabaseService.toggleTableDisplay(prev, tableId, columnId),
    );
  };

  // 設定の保存
  const handleSave = () => {
    // TODO: 実際の保存処理（localStorage / API等）
    console.log('案件データベース設定を保存:', state);
    alert('案件データベース設定を保存しました');
  };

  return (
    <div className='flex flex-col'>
      {/* ページヘッダー */}
      <div className='p-4'>
        <div className='flex items-center justify-between space-x-4'>
          <div className='flex items-center gap-4'></div>

          <div className='flex items-center space-x-2'>
            <Button
              onClick={handleSave}
              size='lg'
              className='flex items-center gap-2'
            >
              <Save className='h-4 w-4' />
              案件設定を保存
            </Button>
          </div>
        </div>
      </div>

      {/* テーブル設定エリア */}
      <div className='space-y-8 px-4 pb-4'>
        {state.projectTables.map((table) => (
          <div key={table.id} className='space-y-4'>
            {/* テーブルヘッダー */}
            <div className='flex items-center gap-3'>
              <Briefcase className='text-primary h-6 w-6' />
              <h2 className='text-primary text-xl font-semibold'>
                {table.name}
              </h2>
            </div>

            {/* 各テーブルの項目設定 */}
            <DatabaseColumnSetting
              columns={state.projectColumns[table.id] || []}
              onUpdateColumn={(columnId, updates) =>
                handleUpdateColumn(table.id, columnId, updates)
              }
              onDeleteColumn={(columnId) =>
                handleDeleteColumn(table.id, columnId)
              }
              onAddColumn={() => handleAddColumn(table.id)}
              onToggleRequired={(columnId) =>
                handleToggleRequired(table.id, columnId)
              }
              onToggleBasicInfo={(columnId) =>
                handleToggleBasicInfo(table.id, columnId)
              }
              onToggleTableDisplay={(columnId) =>
                handleToggleTableDisplay(table.id, columnId)
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
}
