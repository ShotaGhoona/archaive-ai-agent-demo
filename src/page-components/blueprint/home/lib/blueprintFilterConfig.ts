import { FilterConfig } from '@/shared';
import { DrawingPageBaseDataInterface } from '@/dummy-data-er-fix/blueprint';

export const BLUEPRINT_FILTER_CONFIG: FilterConfig<DrawingPageBaseDataInterface>[] =
  [
    {
      key: 'id',
      label: 'ID',
      type: 'number',
      placeholder: 'IDで検索',
    },
    {
      key: 'drawing_file_id',
      label: '図面ファイルID',
      type: 'number',
      placeholder: '図面ファイルIDで検索',
    },
    {
      key: 'drawing_number',
      label: '図面番号',
      type: 'text',
      placeholder: '図面番号で検索',
    },
    {
      key: 'external_drawing_number',
      label: '外部図面番号',
      type: 'text',
      placeholder: '外部図面番号で検索',
    },
    {
      key: 'page_number',
      label: 'ページ番号',
      type: 'number',
      placeholder: 'ページ番号で検索',
    },
    {
      key: 'drawing_file_name',
      label: 'ファイル名',
      type: 'text',
      placeholder: 'ファイル名で検索',
    },
    {
      key: 'drawing_file_extension',
      label: 'ファイル拡張子',
      type: 'select',
      options: ['dwg', 'dxf', 'pdf', 'step', 'iges'],
      defaultValue: 'all',
    },
    {
      key: 'leaf_product_name',
      label: '製品名',
      type: 'text',
      placeholder: '製品名で検索',
    },
    {
      key: 'customer_name',
      label: '顧客名',
      type: 'text',
      placeholder: '顧客名で検索',
    },
    {
      key: 'company_name',
      label: '会社名',
      type: 'text',
      placeholder: '会社名で検索',
    },
    {
      key: 'drawing_category_name',
      label: '図面カテゴリ',
      type: 'select',
      options: ['本図面', '参考図面', '製品図', '部品図', '組立図'],
      defaultValue: 'all',
    },
    {
      key: 'drawing_page_custom_items.材質.value',
      label: '材質',
      type: 'select',
      options: ['S45C', 'SUS304', 'A5052', 'SS400', 'SCM440'],
      defaultValue: 'all',
    },
    {
      key: 'drawing_page_custom_items.表面処理.value',
      label: '表面処理',
      type: 'select',
      options: ['亜鉛めっき', 'ニッケルめっき', 'クロムめっき', '無処理', '陽極酸化'],
      defaultValue: 'all',
    },
    {
      key: 'drawing_page_custom_items.熱処理.value',
      label: '熱処理',
      type: 'select',
      options: ['調質', '焼入れ', '焼なまし', '残留応力除去', '無処理'],
      defaultValue: 'all',
    },
    {
      key: 'drawing_page_custom_items.検査レベル.value',
      label: '検査レベル',
      type: 'select',
      options: ['A', 'B', 'C', '特級'],
      defaultValue: 'all',
    },
    {
      key: 'created_by_name',
      label: '作成者',
      type: 'text',
      placeholder: '作成者で検索',
    },
    {
      key: 'updated_by_name',
      label: '更新者',
      type: 'text',
      placeholder: '更新者で検索',
    },
    {
      key: 'created_at',
      label: '作成日時',
      type: 'dateRange',
    },
    {
      key: 'updated_at',
      label: '更新日時',
      type: 'dateRange',
    },
  ];
