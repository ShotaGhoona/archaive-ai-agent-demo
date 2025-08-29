'use client';

import { useState } from 'react';
import { Button, Input } from '@/shared';
import { Save, FileText, Plus } from 'lucide-react';
import { DatabaseColumnSetting } from '@/widgets';
import { DatabaseColumnSettingConfig } from '@/widgets';
import { DEFAULT_DOCUMENT_CATEGORIES, DocumentType, DocumentCategory } from '../lib';
import { TabNavigation } from '@/shared/components/tab-navigation/ui/TabNavigation';
import { TabItem } from '@/shared/components/tab-navigation/model/types';

export function DocumentDatabaseSettingContainer() {
  // カテゴリ管理
  const [documentCategories, setDocumentCategories] = useState<DocumentCategory[]>(DEFAULT_DOCUMENT_CATEGORIES);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('project-related');

  // 各帳票タイプのカラム設定を管理
  const [documentColumns, setDocumentColumns] = useState<Record<string, DatabaseColumnSettingConfig[]>>(() => {
    const allColumns: Record<string, DatabaseColumnSettingConfig[]> = {};
    DEFAULT_DOCUMENT_CATEGORIES.forEach(category => {
      category.documentTypes.forEach(type => {
        allColumns[type.id] = type.defaultColumns;
      });
    });
    return allColumns;
  });

  // 帳票タイプ名の管理
  const [documentTypeNames, setDocumentTypeNames] = useState<Record<string, string>>(() => {
    const allNames: Record<string, string> = {};
    DEFAULT_DOCUMENT_CATEGORIES.forEach(category => {
      category.documentTypes.forEach(type => {
        allNames[type.id] = type.name;
      });
    });
    return allNames;
  });

  // 列設定の更新
  const handleUpdateColumn = (typeId: string, columnId: string, updates: Partial<DatabaseColumnSettingConfig>) => {
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
    const newColumn: DatabaseColumnSettingConfig = {
      id: `custom-${Date.now()}`,
      name: '',
      description: '',
      dataType: 'text',
    };
    
    setDocumentColumns(prev => ({
      ...prev,
      [typeId]: [...(prev[typeId] || []), newColumn]
    }));
  };

  // 帳票タイプ名の更新
  const handleUpdateTypeName = (typeId: string, newName: string) => {
    setDocumentTypeNames(prev => ({
      ...prev,
      [typeId]: newName
    }));
  };

  // 新しい帳票タイプを追加
  const handleAddDocumentType = () => {
    const newTypeId = `custom-${Date.now()}`;
    const newType: DocumentType = {
      id: newTypeId,
      name: '新しい帳票',
      defaultColumns: [],
    };

    setDocumentCategories(prev => prev.map(category => 
      category.id === selectedCategoryId 
        ? { ...category, documentTypes: [...category.documentTypes, newType] }
        : category
    ));
    setDocumentColumns(prev => ({
      ...prev,
      [newTypeId]: [],
    }));
    setDocumentTypeNames(prev => ({
      ...prev,
      [newTypeId]: '新しい帳票',
    }));
  };

  // 設定の保存
  const handleSave = () => {
    // TODO: 実際の保存処理（localStorage / API等）
    console.log('帳票データベース設定を保存:', { documentCategories, documentTypeNames, documentColumns });
    alert('帳票データベース設定を保存しました');
  };

  // タブアイテムをカテゴリデータから生成
  const tabItems: TabItem[] = documentCategories.map(category => ({
    key: category.id,
    label: category.name,
    icon: category.icon
  }));

  // 現在選択されているカテゴリを取得
  const selectedCategory = documentCategories.find(category => category.id === selectedCategoryId);
  const currentDocumentTypes = selectedCategory?.documentTypes || [];

  return (
    <div className="flex flex-col">
      {/* タブナビゲーション */}
      <TabNavigation
        items={tabItems}
        selectedKey={selectedCategoryId}
        onTabChange={setSelectedCategoryId}
      />
      {/* ページヘッダー */}
      <div className="p-4">
        <div className="flex items-center justify-between space-x-4">
          <div className="flex items-center gap-4">
            {/* <h1 className="text-2xl font-bold">帳票データベース設定</h1> */}
          </div>
          
          <div className="flex items-center space-x-2">
            <Button onClick={handleSave} size="lg" className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              帳票設定を保存
            </Button>
          </div>
        </div>
      </div>

      {/* 選択されたカテゴリの帳票タイプ設定エリア */}
      <div className="px-4 pb-4 space-y-8">
        {selectedCategory && (
          <div className="space-y-4">
            {/* 帳票タイプ一覧 */}
            {currentDocumentTypes.map(type => (
              <div key={type.id} className="space-y-4">
                {/* 帳票タイプヘッダー */}
                <div className="flex items-center gap-3">
                  <FileText className="h-6 w-6 text-primary" />
                  <input
                    value={documentTypeNames[type.id] || type.name}
                    onChange={(e) => handleUpdateTypeName(type.id, e.target.value)}
                    className="text-xl font-semibold border-0 shadow-none focus:ring-1 focus:ring-blue-500 p-0 h-auto bg-transparent text-primary"
                    placeholder="帳票タイプ名を入力"
                  />
                </div>
                
                {/* 各帳票タイプの項目設定 */}
                <DatabaseColumnSetting
                  columns={documentColumns[type.id] || []}
                  onUpdateColumn={(columnId, updates) => handleUpdateColumn(type.id, columnId, updates)}
                  onDeleteColumn={(columnId) => handleDeleteColumn(type.id, columnId)}
                  onAddColumn={() => handleAddColumn(type.id)}
                />
              </div>
            ))}

            {/* 新しい帳票タイプ追加ボタン */}
            <div className="flex justify-center pt-4">
              <Button
                onClick={handleAddDocumentType}
                variant="outline"
                size="lg"
                className="flex items-center gap-2 border-2 border-dashed border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-700 hover:bg-gray-50 py-6 px-8"
              >
                <Plus className="h-5 w-5" />
                帳票タイプを追加
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}