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
    };

    return {
      ...state,
      customerColumns: {
        ...state.customerColumns,
        [tableId]: [...(state.customerColumns[tableId] || []), newColumn]
      }
    };
  }
}