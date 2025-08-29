import { DatabaseColumnSettingConfig } from '@/widgets';

export interface ProjectTable {
  id: string;
  name: string;
  defaultColumns: DatabaseColumnSettingConfig[];
}

export interface ProjectDatabaseState {
  projectTables: ProjectTable[];
  projectColumns: Record<string, DatabaseColumnSettingConfig[]>;
}

export class ProjectDatabaseService {
  /**
   * カラム設定を更新
   */
  static updateColumn(
    state: ProjectDatabaseState,
    tableId: string,
    columnId: string,
    updates: Partial<DatabaseColumnSettingConfig>
  ): ProjectDatabaseState {
    return {
      ...state,
      projectColumns: {
        ...state.projectColumns,
        [tableId]: state.projectColumns[tableId].map(col => 
          col.id === columnId ? { ...col, ...updates } : col
        )
      }
    };
  }

  /**
   * カラムを削除
   */
  static deleteColumn(
    state: ProjectDatabaseState,
    tableId: string,
    columnId: string
  ): ProjectDatabaseState {
    return {
      ...state,
      projectColumns: {
        ...state.projectColumns,
        [tableId]: state.projectColumns[tableId].filter(col => col.id !== columnId)
      }
    };
  }

  /**
   * 新しいカラムを追加
   */
  static addColumn(
    state: ProjectDatabaseState,
    tableId: string
  ): ProjectDatabaseState {
    const newColumn: DatabaseColumnSettingConfig = {
      id: `custom-${Date.now()}`,
      name: '',
      description: '',
      dataType: 'text',
    };

    return {
      ...state,
      projectColumns: {
        ...state.projectColumns,
        [tableId]: [...(state.projectColumns[tableId] || []), newColumn]
      }
    };
  }
}