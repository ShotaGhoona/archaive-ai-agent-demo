import { DatabaseColumnSettingConfig } from '@/widgets';

export interface BlueprintTable {
  id: string;
  name: string;
  defaultColumns: DatabaseColumnSettingConfig[];
}

export interface BlueprintDatabaseState {
  blueprintTables: BlueprintTable[];
  blueprintColumns: Record<string, DatabaseColumnSettingConfig[]>;
}

export class BlueprintDatabaseService {
  /**
   * カラム設定を更新
   */
  static updateColumn(
    state: BlueprintDatabaseState,
    tableId: string,
    columnId: string,
    updates: Partial<DatabaseColumnSettingConfig>
  ): BlueprintDatabaseState {
    return {
      ...state,
      blueprintColumns: {
        ...state.blueprintColumns,
        [tableId]: state.blueprintColumns[tableId].map(col => 
          col.id === columnId ? { ...col, ...updates } : col
        )
      }
    };
  }

  /**
   * カラムを削除
   */
  static deleteColumn(
    state: BlueprintDatabaseState,
    tableId: string,
    columnId: string
  ): BlueprintDatabaseState {
    return {
      ...state,
      blueprintColumns: {
        ...state.blueprintColumns,
        [tableId]: state.blueprintColumns[tableId].filter(col => col.id !== columnId)
      }
    };
  }

  /**
   * 新しいカラムを追加
   */
  static addColumn(
    state: BlueprintDatabaseState,
    tableId: string
  ): BlueprintDatabaseState {
    const newColumn: DatabaseColumnSettingConfig = {
      id: `custom-${Date.now()}`,
      name: '',
      description: '',
      dataType: 'text',
    };

    return {
      ...state,
      blueprintColumns: {
        ...state.blueprintColumns,
        [tableId]: [...(state.blueprintColumns[tableId] || []), newColumn]
      }
    };
  }
}