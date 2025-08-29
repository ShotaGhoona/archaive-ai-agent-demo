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
      isRequired: false,
      showInBasicInfo: true,
      showInTable: true,
    };

    return {
      ...state,
      blueprintColumns: {
        ...state.blueprintColumns,
        [tableId]: [...(state.blueprintColumns[tableId] || []), newColumn]
      }
    };
  }

  /**
   * 必須フラグを切り替え
   */
  static toggleRequired(
    state: BlueprintDatabaseState,
    tableId: string,
    columnId: string
  ): BlueprintDatabaseState {
    // TODO: バックエンド処理（バリデーション、DB更新等）を実装
    console.log('TODO: 必須フラグのバックエンド処理', { tableId, columnId });
    
    return {
      ...state,
      blueprintColumns: {
        ...state.blueprintColumns,
        [tableId]: state.blueprintColumns[tableId].map(col => 
          col.id === columnId ? { ...col, isRequired: !col.isRequired } : col
        )
      }
    };
  }

  /**
   * 基本情報表示フラグを切り替え
   */
  static toggleBasicInfo(
    state: BlueprintDatabaseState,
    tableId: string,
    columnId: string
  ): BlueprintDatabaseState {
    // TODO: バックエンド処理（表示設定保存等）を実装
    console.log('TODO: 基本情報表示のバックエンド処理', { tableId, columnId });
    
    return {
      ...state,
      blueprintColumns: {
        ...state.blueprintColumns,
        [tableId]: state.blueprintColumns[tableId].map(col => 
          col.id === columnId ? { ...col, showInBasicInfo: !col.showInBasicInfo } : col
        )
      }
    };
  }

  /**
   * テーブル表示フラグを切り替え
   */
  static toggleTableDisplay(
    state: BlueprintDatabaseState,
    tableId: string,
    columnId: string
  ): BlueprintDatabaseState {
    // TODO: バックエンド処理（テーブル設定保存等）を実装
    console.log('TODO: テーブル表示のバックエンド処理', { tableId, columnId });
    
    return {
      ...state,
      blueprintColumns: {
        ...state.blueprintColumns,
        [tableId]: state.blueprintColumns[tableId].map(col => 
          col.id === columnId ? { ...col, showInTable: !col.showInTable } : col
        )
      }
    };
  }
}