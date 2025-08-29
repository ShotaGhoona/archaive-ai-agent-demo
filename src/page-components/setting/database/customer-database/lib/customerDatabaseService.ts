import { DatabaseColumnSettingConfig } from '@/widgets';

export interface CustomerTable {
  id: string;
  name: string;
  defaultColumns: DatabaseColumnSettingConfig[];
}

export interface CustomerDatabaseState {
  customerTables: CustomerTable[];
  customerColumns: Record<string, DatabaseColumnSettingConfig[]>;
}

export class CustomerDatabaseService {
  /**
   * カラム設定を更新
   */
  static updateColumn(
    state: CustomerDatabaseState,
    tableId: string,
    columnId: string,
    updates: Partial<DatabaseColumnSettingConfig>
  ): CustomerDatabaseState {
    return {
      ...state,
      customerColumns: {
        ...state.customerColumns,
        [tableId]: state.customerColumns[tableId].map(col => 
          col.id === columnId ? { ...col, ...updates } : col
        )
      }
    };
  }

  /**
   * カラムを削除
   */
  static deleteColumn(
    state: CustomerDatabaseState,
    tableId: string,
    columnId: string
  ): CustomerDatabaseState {
    return {
      ...state,
      customerColumns: {
        ...state.customerColumns,
        [tableId]: state.customerColumns[tableId].filter(col => col.id !== columnId)
      }
    };
  }

  /**
   * 新しいカラムを追加
   */
  static addColumn(
    state: CustomerDatabaseState,
    tableId: string
  ): CustomerDatabaseState {
    const newColumn: DatabaseColumnSettingConfig = {
      id: `custom-${Date.now()}`,
      name: '',
      description: '',
      dataType: 'text',
      isRequired: false,
      showInBasicInfo: true,
      showInTable: true,
    };

    return {
      ...state,
      customerColumns: {
        ...state.customerColumns,
        [tableId]: [...(state.customerColumns[tableId] || []), newColumn]
      }
    };
  }

  /**
   * 必須フラグを切り替え
   */
  static toggleRequired(
    state: CustomerDatabaseState,
    tableId: string,
    columnId: string
  ): CustomerDatabaseState {
    // TODO: バックエンド処理（バリデーション、DB更新等）を実装
    console.log('TODO: 必須フラグのバックエンド処理', { tableId, columnId });
    
    return {
      ...state,
      customerColumns: {
        ...state.customerColumns,
        [tableId]: state.customerColumns[tableId].map(col => 
          col.id === columnId ? { ...col, isRequired: !col.isRequired } : col
        )
      }
    };
  }

  /**
   * 基本情報表示フラグを切り替え
   */
  static toggleBasicInfo(
    state: CustomerDatabaseState,
    tableId: string,
    columnId: string
  ): CustomerDatabaseState {
    // TODO: バックエンド処理（表示設定保存等）を実装
    console.log('TODO: 基本情報表示のバックエンド処理', { tableId, columnId });
    
    return {
      ...state,
      customerColumns: {
        ...state.customerColumns,
        [tableId]: state.customerColumns[tableId].map(col => 
          col.id === columnId ? { ...col, showInBasicInfo: !col.showInBasicInfo } : col
        )
      }
    };
  }

  /**
   * テーブル表示フラグを切り替え
   */
  static toggleTableDisplay(
    state: CustomerDatabaseState,
    tableId: string,
    columnId: string
  ): CustomerDatabaseState {
    // TODO: バックエンド処理（テーブル設定保存等）を実装
    console.log('TODO: テーブル表示のバックエンド処理', { tableId, columnId });
    
    return {
      ...state,
      customerColumns: {
        ...state.customerColumns,
        [tableId]: state.customerColumns[tableId].map(col => 
          col.id === columnId ? { ...col, showInTable: !col.showInTable } : col
        )
      }
    };
  }
}