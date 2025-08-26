import { FilterConfig } from '@/shared';
import { Blueprint } from '../lib';

export const BLUEPRINT_FILTER_CONFIG: FilterConfig<Blueprint>[] = [
  {
    key: 'filename',
    label: 'ファイル名',
    type: 'text',
    placeholder: 'ファイル名を入力'
  },
  {
    key: 'orderSource',
    label: '発注元',
    type: 'text',
    placeholder: '発注元を入力'
  },
  {
    key: 'productName',
    label: '製品名',
    type: 'text',
    placeholder: '製品名を入力'
  },
  {
    key: 'internalNumber',
    label: '社内整番',
    type: 'text',
    placeholder: '社内整番を入力'
  },
  {
    key: 'customerNumber',
    label: '客先整番',
    type: 'text',
    placeholder: '客先整番を入力'
  },
  {
    key: 'cadName',
    label: 'CAD名',
    type: 'select',
    options: [
      'AutoCAD 2024',
      'SolidWorks 2024',
      'Inventor 2024',
      'CATIA V5'
    ],
    defaultValue: 'all'
  },
  {
    key: 'camName',
    label: 'CAM名',
    type: 'select',
    options: [
      'Mastercam X9',
      'CAMWorks',
      'PowerMill',
      'ESPRIT',
      'GibbsCAM',
      'EdgeCAM',
      'hyperMILL'
    ],
    defaultValue: 'all'
  },
  {
    key: 'orderQuantity',
    label: '受注個数',
    type: 'number',
    placeholder: '受注個数を入力'
  },
  {
    key: 'orderDate',
    label: '受注日',
    type: 'dateRange'
  },
  {
    key: 'deliveryDate',
    label: '納品日',
    type: 'dateRange'
  },
  {
    key: 'companyField',
    label: '業界・分野',
    type: 'select',
    options: [
      '自動車部品',
      '産業機械',
      '重機部品',
      '減速機',
      '精密機械',
      '電気機械',
      '電子機器',
      'サスペンション',
      'ポンプ機器',
      '建設機械',
      '油圧機器',
      '歯車',
      '流体制御',
      '治具',
      '熱機器',
      'センサー',
      '駆動系',
      'フィルター',
      '関節部品',
      '圧縮機'
    ],
    defaultValue: 'all'
  }
];