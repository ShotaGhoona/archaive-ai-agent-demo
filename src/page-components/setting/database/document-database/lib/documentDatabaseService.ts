import { DatabaseColumnSettingConfig } from '@/widgets';
import { DocumentCategory, DocumentType } from '../model/types';
import { createNewDocument } from './documentTypeFactory';

export interface DocumentDatabaseState {
  documentCategories: DocumentCategory[];
  documentColumns: Record<string, DatabaseColumnSettingConfig[]>;
  documentTypeNames: Record<string, string>;
}

export class DocumentDatabaseService {
  /**
   * カラム設定を更新
   */
  static updateColumn(
    state: DocumentDatabaseState,
    typeId: string,
    columnId: string,
    updates: Partial<DatabaseColumnSettingConfig>
  ): DocumentDatabaseState {
    return {
      ...state,
      documentColumns: {
        ...state.documentColumns,
        [typeId]: state.documentColumns[typeId].map(col => 
          col.id === columnId ? { ...col, ...updates } : col
        )
      }
    };
  }

  /**
   * カラムを削除
   */
  static deleteColumn(
    state: DocumentDatabaseState,
    typeId: string,
    columnId: string
  ): DocumentDatabaseState {
    return {
      ...state,
      documentColumns: {
        ...state.documentColumns,
        [typeId]: state.documentColumns[typeId].filter(col => col.id !== columnId)
      }
    };
  }

  /**
   * 新しいカラムを追加
   */
  static addColumn(
    state: DocumentDatabaseState,
    typeId: string
  ): DocumentDatabaseState {
    const newColumn: DatabaseColumnSettingConfig = {
      id: `custom-${Date.now()}`,
      name: '',
      description: '',
      dataType: 'text',
    };

    return {
      ...state,
      documentColumns: {
        ...state.documentColumns,
        [typeId]: [...(state.documentColumns[typeId] || []), newColumn]
      }
    };
  }

  /**
   * 帳票タイプ名を更新
   */
  static updateTypeName(
    state: DocumentDatabaseState,
    typeId: string,
    newName: string
  ): DocumentDatabaseState {
    return {
      ...state,
      documentTypeNames: {
        ...state.documentTypeNames,
        [typeId]: newName
      }
    };
  }

  /**
   * 新しい帳票タイプを追加
   */
  static addDocumentType(
    state: DocumentDatabaseState,
    selectedCategoryId: string
  ): DocumentDatabaseState {
    const { type: newType, defaultColumns } = createNewDocument(selectedCategoryId);

    return {
      documentCategories: state.documentCategories.map(category => 
        category.id === selectedCategoryId 
          ? { ...category, documentTypes: [...category.documentTypes, newType] }
          : category
      ),
      documentColumns: {
        ...state.documentColumns,
        [newType.id]: defaultColumns,
      },
      documentTypeNames: {
        ...state.documentTypeNames,
        [newType.id]: '新しい帳票',
      }
    };
  }
}