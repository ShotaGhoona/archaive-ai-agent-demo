'use client';

import { useState } from 'react';
import { Button, Input } from '@/shared';
import { Save, FileText, Plus } from 'lucide-react';
import { DatabaseColumnSetting } from '@/widgets';
import { DatabaseColumnSettingConfig } from '@/widgets';
import { DEFAULT_DOCUMENT_CATEGORIES, DocumentDatabaseService, DocumentType, DocumentCategory, DocumentDatabaseState } from '../lib';
import { TabNavigation } from '@/shared/components/tab-navigation/ui/TabNavigation';
import { TabItem } from '@/shared/components/tab-navigation/model/types';

export function DocumentDatabaseSettingContainer() {
  // カテゴリ管理
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('project-related');

  // データベース状態の管理
  const [state, setState] = useState<DocumentDatabaseState>(() => {
    const allColumns: Record<string, DatabaseColumnSettingConfig[]> = {};
    const allNames: Record<string, string> = {};
    
    DEFAULT_DOCUMENT_CATEGORIES.forEach(category => {
      category.documentTypes.forEach(type => {
        allColumns[type.id] = type.defaultColumns;
        allNames[type.id] = type.name;
      });
    });

    return {
      documentCategories: DEFAULT_DOCUMENT_CATEGORIES,
      documentColumns: allColumns,
      documentTypeNames: allNames,
    };
  });

  // 列設定の更新
  const handleUpdateColumn = (typeId: string, columnId: string, updates: Partial<DatabaseColumnSettingConfig>) => {
    setState(prev => DocumentDatabaseService.updateColumn(prev, typeId, columnId, updates));
  };

  // 列の削除
  const handleDeleteColumn = (typeId: string, columnId: string) => {
    setState(prev => DocumentDatabaseService.deleteColumn(prev, typeId, columnId));
  };

  // 新規列の追加
  const handleAddColumn = (typeId: string) => {
    setState(prev => DocumentDatabaseService.addColumn(prev, typeId));
  };

  // 帳票タイプ名の更新
  const handleUpdateTypeName = (typeId: string, newName: string) => {
    setState(prev => DocumentDatabaseService.updateTypeName(prev, typeId, newName));
  };

  // 新しい帳票タイプを追加
  const handleAddDocumentType = () => {
    setState(prev => DocumentDatabaseService.addDocumentType(prev, selectedCategoryId));
  };

  // TODO: 必須フラグ切り替え
  const handleToggleRequired = (typeId: string, columnId: string) => {
    setState(prev => DocumentDatabaseService.toggleRequired(prev, typeId, columnId));
  };

  // TODO: 基本情報表示切り替え
  const handleToggleBasicInfo = (typeId: string, columnId: string) => {
    setState(prev => DocumentDatabaseService.toggleBasicInfo(prev, typeId, columnId));
  };

  // TODO: テーブル表示切り替え
  const handleToggleTableDisplay = (typeId: string, columnId: string) => {
    setState(prev => DocumentDatabaseService.toggleTableDisplay(prev, typeId, columnId));
  };

  // 設定の保存
  const handleSave = () => {
    // TODO: 実際の保存処理（localStorage / API等）
    console.log('帳票データベース設定を保存:', state);
    alert('帳票データベース設定を保存しました');
  };

  // タブアイテムをカテゴリデータから生成
  const tabItems: TabItem[] = state.documentCategories.map(category => ({
    key: category.id,
    label: category.name,
    icon: category.icon
  }));

  // 現在選択されているカテゴリを取得
  const selectedCategory = state.documentCategories.find(category => category.id === selectedCategoryId);
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
                    value={state.documentTypeNames[type.id] || type.name}
                    onChange={(e) => handleUpdateTypeName(type.id, e.target.value)}
                    className="text-xl font-semibold border-0 shadow-none focus:ring-1 focus:ring-blue-500 p-0 h-auto bg-transparent text-primary"
                    placeholder="帳票タイプ名を入力"
                  />
                </div>
                
                {/* 各帳票タイプの項目設定 */}
                <DatabaseColumnSetting
                  columns={state.documentColumns[type.id] || []}
                  onUpdateColumn={(columnId, updates) => handleUpdateColumn(type.id, columnId, updates)}
                  onDeleteColumn={(columnId) => handleDeleteColumn(type.id, columnId)}
                  onAddColumn={() => handleAddColumn(type.id)}
                  onToggleRequired={(columnId) => handleToggleRequired(type.id, columnId)}
                  onToggleBasicInfo={(columnId) => handleToggleBasicInfo(type.id, columnId)}
                  onToggleTableDisplay={(columnId) => handleToggleTableDisplay(type.id, columnId)}
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