export interface SelectOption {
  id: string;
  label: string;
  color: string;
}

export interface ColumnConfig {
  id: string;
  name: string;
  displayEnabled: boolean;
  filterEnabled: boolean;
  dataType: 'text' | 'number' | 'date' | 'select' | 'user' | 'boolean';
  order: number;
  options?: SelectOption[]; // select用の選択肢（色付き）
}

export interface DatabaseConfig {
  columns: ColumnConfig[];
  lastUpdated: string;
}

// プレビューテーブル用のサンプルデータ型
export interface PreviewData {
  [key: string]: string | number | boolean;
}

// 従業員のダミーデータ
const SAMPLE_EMPLOYEES = [
  '山田太郎',
  '佐藤花子',
  '田中一郎',
  '鈴木美咲',
  '高橋健太',
  '伊藤優子',
  '渡辺大輔',
  '中村麻衣',
  '小林正和',
  '加藤綾香'
];

// データ型に応じたサンプルデータ生成
export const generateSampleValue = (dataType: ColumnConfig['dataType'], options?: SelectOption[]): string | boolean => {
  switch (dataType) {
    case 'text':
      return 'Sample Text';
    case 'number':
      return '123';
    case 'date':
      return 'YYYY/MM/DD';
    case 'select':
      if (options && options.length > 0) {
        // ランダムに選択肢から選ぶ
        const randomOption = options[Math.floor(Math.random() * options.length)];
        return randomOption.label;
      }
      return '選択肢なし';
    case 'user':
      // ランダムに従業員を選択
      return SAMPLE_EMPLOYEES[Math.floor(Math.random() * SAMPLE_EMPLOYEES.length)];
    case 'boolean':
      // ランダムにtrue/falseを返す
      return Math.random() > 0.5;
    default:
      return 'Sample Text';
  }
};

// Widget用のプロパティ型
export interface DatabaseColumnSettingProps {
  defaultColumns: ColumnConfig[];
  databaseType: string;
  pageTitle: string;
}