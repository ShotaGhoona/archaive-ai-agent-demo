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
      return '2024/01/15';
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

// デフォルトの列設定（blueprintColumns.tsxの構造に合わせて設定）
export const DEFAULT_COLUMNS: ColumnConfig[] = [
  {
    id: 'filename',
    name: 'ファイル名',
    displayEnabled: true,
    filterEnabled: true,
    dataType: 'text',
    order: 1,
  },
  {
    id: 'orderSource',
    name: '発注元',
    displayEnabled: true,
    filterEnabled: true,
    dataType: 'text',
    order: 2,
  },
  {
    id: 'productName',
    name: '製品名',
    displayEnabled: true,
    filterEnabled: true,
    dataType: 'text',
    order: 3,
  },
  {
    id: 'internalNumber',
    name: '社内整番',
    displayEnabled: true,
    filterEnabled: true,
    dataType: 'text',
    order: 4,
  },
  {
    id: 'customerNumber',
    name: '客先整番',
    displayEnabled: true,
    filterEnabled: true,
    dataType: 'text',
    order: 5,
  },
  {
    id: 'cadName',
    name: 'CAD担当者',
    displayEnabled: false,
    filterEnabled: true,
    dataType: 'user',
    order: 6,
  },
  {
    id: 'camName',
    name: 'CAM担当者',
    displayEnabled: false,
    filterEnabled: true,
    dataType: 'user',
    order: 7,
  },
  {
    id: 'orderQuantity',
    name: '受注個数',
    displayEnabled: true,
    filterEnabled: true,
    dataType: 'number',
    order: 8,
  },
  {
    id: 'orderDate',
    name: '受注日',
    displayEnabled: true,
    filterEnabled: true,
    dataType: 'date',
    order: 9,
  },
  {
    id: 'deliveryDate',
    name: '納品日',
    displayEnabled: true,
    filterEnabled: true,
    dataType: 'date',
    order: 10,
  },
  {
    id: 'maxDimensionL',
    name: '最大長',
    displayEnabled: false,
    filterEnabled: false,
    dataType: 'number',
    order: 11,
  },
  {
    id: 'maxDimensionD',
    name: '最大幅',
    displayEnabled: false,
    filterEnabled: false,
    dataType: 'number',
    order: 12,
  },
  {
    id: 'maxDimensionH',
    name: '最大高',
    displayEnabled: false,
    filterEnabled: false,
    dataType: 'number',
    order: 13,
  },
  {
    id: 'companyField',
    name: '全社項目',
    displayEnabled: true,
    filterEnabled: true,
    dataType: 'text',
    order: 14,
  },
];