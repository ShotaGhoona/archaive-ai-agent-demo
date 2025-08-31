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
    updates: Partial<DatabaseColumnSettingConfig>,
  ): ProjectDatabaseState {
    return {
      ...state,
      projectColumns: {
        ...state.projectColumns,
        [tableId]: state.projectColumns[tableId].map((col) =>
          col.id === columnId ? { ...col, ...updates } : col,
        ),
      },
    };
  }

  /**
   * カラムを削除
   */
  static deleteColumn(
    state: ProjectDatabaseState,
    tableId: string,
    columnId: string,
  ): ProjectDatabaseState {
    return {
      ...state,
      projectColumns: {
        ...state.projectColumns,
        [tableId]: state.projectColumns[tableId].filter(
          (col) => col.id !== columnId,
        ),
      },
    };
  }

  /**
   * 新しいカラムを追加
   */
  static addColumn(
    state: ProjectDatabaseState,
    tableId: string,
  ): ProjectDatabaseState {
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
      projectColumns: {
        ...state.projectColumns,
        [tableId]: [...(state.projectColumns[tableId] || []), newColumn],
      },
    };
  }

  /**
   * 必須フラグを切り替え
   */
  static toggleRequired(
    state: ProjectDatabaseState,
    tableId: string,
    columnId: string,
  ): ProjectDatabaseState {
    // TODO: バックエンド処理（バリデーション、DB更新等）を実装
    console.log('TODO: 必須フラグのバックエンド処理', { tableId, columnId });

    return {
      ...state,
      projectColumns: {
        ...state.projectColumns,
        [tableId]: state.projectColumns[tableId].map((col) =>
          col.id === columnId ? { ...col, isRequired: !col.isRequired } : col,
        ),
      },
    };
  }

  /**
   * 基本情報表示フラグを切り替え
   */
  static toggleBasicInfo(
    state: ProjectDatabaseState,
    tableId: string,
    columnId: string,
  ): ProjectDatabaseState {
    // TODO: バックエンド処理（表示設定保存等）を実装
    console.log('TODO: 基本情報表示のバックエンド処理', { tableId, columnId });

    return {
      ...state,
      projectColumns: {
        ...state.projectColumns,
        [tableId]: state.projectColumns[tableId].map((col) =>
          col.id === columnId
            ? { ...col, showInBasicInfo: !col.showInBasicInfo }
            : col,
        ),
      },
    };
  }

  /**
   * テーブル表示フラグを切り替え
   */
  static toggleTableDisplay(
    state: ProjectDatabaseState,
    tableId: string,
    columnId: string,
  ): ProjectDatabaseState {
    // TODO: バックエンド処理（テーブル設定保存等）を実装
    console.log('TODO: テーブル表示のバックエンド処理', { tableId, columnId });

    return {
      ...state,
      projectColumns: {
        ...state.projectColumns,
        [tableId]: state.projectColumns[tableId].map((col) =>
          col.id === columnId ? { ...col, showInTable: !col.showInTable } : col,
        ),
      },
    };
  }
}
