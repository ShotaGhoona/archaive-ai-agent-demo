import { DatabaseColumnSettingConfig } from '@/widgets';
import { DocumentType } from '../model/types';
import { COMMON_COLUMNS } from './documentColumnSettingConfig';

/**
 * 新しい帳票タイプを生成するためのファクトリー関数
 */
export function createNewDocument(categoryId: string): {
  type: DocumentType;
  defaultColumns: DatabaseColumnSettingConfig[];
} {
  const newTypeId = `custom-${Date.now()}`;
  
  // カテゴリに応じたデフォルトIDカラムを生成
  const categoryIdColumn: DatabaseColumnSettingConfig = categoryId === 'project-related' 
    ? {
        id: 'project_id',
        name: '案件ID',
        description: '案件を一意に識別',
        dataType: 'text',
        editable: false,
      }
    : {
        id: 'product_id',
        name: '製品ID',
        description: '製品を一意に識別',
        dataType: 'text',
        editable: false,
      };

  // 新しい帳票タイプのIDカラム
  const typeIdColumn: DatabaseColumnSettingConfig = {
    id: `${newTypeId}_id`,
    name: '帳票ID',
    description: 'この帳票の一意識別子',
    dataType: 'text',
    editable: false,
  };

  // デフォルトカラム = 帳票ID + カテゴリID + 共通項目
  const defaultColumns = [typeIdColumn, categoryIdColumn, ...COMMON_COLUMNS];

  const newType: DocumentType = {
    id: newTypeId,
    name: '新しい帳票',
    defaultColumns,
  };

  return {
    type: newType,
    defaultColumns,
  };
}