'use client';

import { useState } from 'react';
import { Button, Input } from '@/shared';
import { Save, FileText } from 'lucide-react';
import { DatabaseColumnSetting } from '@/widgets';
import { ColumnConfig } from '@/widgets';
import { DEFAULT_DOCUMENT_TYPES, DocumentType } from '../lib';

export function DocumentDatabaseSettingContainer() {
  // 各帳票タイプのカラム設定を管理
  const [documentColumns, setDocumentColumns] = useState<Record<string, ColumnConfig[]>>(
    DEFAULT_DOCUMENT_TYPES.reduce((acc, type) => ({
      ...acc,
      [type.id]: type.defaultColumns
    }), {})
  );

  // 帳票タイプ名の管理
  const [documentTypeNames, setDocumentTypeNames] = useState<Record<string, string>>(
    DEFAULT_DOCUMENT_TYPES.reduce((acc, type) => ({
      ...acc,
      [type.id]: type.name
    }), {})
  );

  // 列設定の更新
  const handleUpdateColumn = (typeId: string, columnId: string, updates: Partial<ColumnConfig>) => {
    setDocumentColumns(prev => ({
      ...prev,
      [typeId]: prev[typeId].map(col => 
        col.id === columnId ? { ...col, ...updates } : col
      )
    }));
  };

  // 列の削除
  const handleDeleteColumn = (typeId: string, columnId: string) => {
    setDocumentColumns(prev => ({
      ...prev,
      [typeId]: prev[typeId].filter(col => col.id !== columnId)
    }));
  };

  // 新規列の追加
  const handleAddColumn = (typeId: string) => {
    const currentColumns = documentColumns[typeId] || [];
    const maxOrder = Math.max(...currentColumns.map(col => col.order), 0);
    const newColumn: ColumnConfig = {
      id: `custom-${Date.now()}`,
      name: '',
      description: '',
      displayEnabled: true,
      filterEnabled: false,
      dataType: 'text',
      order: maxOrder + 1,
    };
    
    setDocumentColumns(prev => ({
      ...prev,
      [typeId]: [...(prev[typeId] || []), newColumn]
    }));
  };

  // 列の順序変更
  const handleReorderColumns = (typeId: string, startIndex: number, endIndex: number) => {
    const currentColumns = documentColumns[typeId] || [];
    const sortedColumns = [...currentColumns].sort((a, b) => a.order - b.order);
    const [removed] = sortedColumns.splice(startIndex, 1);
    sortedColumns.splice(endIndex, 0, removed);
    
    // order値を再計算
    const reorderedColumns = sortedColumns.map((col, index) => ({
      ...col,
      order: index + 1,
    }));
    
    setDocumentColumns(prev => ({
      ...prev,
      [typeId]: reorderedColumns
    }));
  };

  // 帳票タイプ名の更新
  const handleUpdateTypeName = (typeId: string, newName: string) => {
    setDocumentTypeNames(prev => ({
      ...prev,
      [typeId]: newName
    }));
  };

  // 設定の保存
  const handleSave = () => {
    // TODO: 実際の保存処理（localStorage / API等）
    console.log('帳票データベース設定を保存:', { documentTypeNames, documentColumns });
    alert('帳票データベース設定を保存しました');
  };

  return (
    <div className="flex flex-col">
      {/* ページヘッダー */}
      <div className="p-4">
        <div className="flex items-center justify-between space-x-4">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">帳票データベース設定</h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button onClick={handleSave} size="lg" className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              帳票設定を保存
            </Button>
          </div>
        </div>
      </div>

      {/* 各帳票タイプの設定エリア */}
      <div className="px-4 pb-4 space-y-8">
        {DEFAULT_DOCUMENT_TYPES.map(type => (
          <div key={type.id} className="space-y-4">
            {/* 帳票タイプヘッダー */}
            <div className="flex items-center gap-3">
              <FileText className="h-6 w-6 text-primary" />
              <input
                value={documentTypeNames[type.id] || type.name}
                onChange={(e) => handleUpdateTypeName(type.id, e.target.value)}
                className="text-xl font-semibold border-0 shadow-none focus:ring-1 focus:ring-blue-500 p-0 h-auto bg-transparent"
                placeholder="帳票タイプ名を入力"
              />
            </div>
            
            {/* 各帳票タイプの項目設定 */}
            <DatabaseColumnSetting
              columns={documentColumns[type.id] || []}
              onUpdateColumn={(columnId, updates) => handleUpdateColumn(type.id, columnId, updates)}
              onDeleteColumn={(columnId) => handleDeleteColumn(type.id, columnId)}
              onAddColumn={() => handleAddColumn(type.id)}
              onReorderColumns={(startIndex, endIndex) => handleReorderColumns(type.id, startIndex, endIndex)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}