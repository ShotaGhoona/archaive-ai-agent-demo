import React from 'react';
import { Button } from '@/shared';
import { Plus } from 'lucide-react';
import { TableViewConfig } from '@/shared/view/table-view';
import { DrawingPageBaseDataInterface } from '@/dummy-data-er-fix/blueprint';

interface CreateRepeatBlueprintTableConfigOptions {
  onRepeatRegister: (blueprint: DrawingPageBaseDataInterface) => void;
}

export const createRepeatBlueprintTableConfig = ({
  onRepeatRegister,
}: CreateRepeatBlueprintTableConfigOptions): TableViewConfig<DrawingPageBaseDataInterface> => ({
  columns: [
    {
      key: 'actions',
      label: 'リピート品',
      width: 120,
      minWidth: 120,
      sortable: false,
      editable: false,
      locked: true,
      stickyLeft: 0,
      render: (blueprint: DrawingPageBaseDataInterface) => (
        <Button
          size='sm'
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onRepeatRegister(blueprint);
          }}
          className='bg-primary hover:bg-primary/90 h-8'
        >
          <Plus className='mr-1 h-3 w-3' />
          登録
        </Button>
      ),
    },
    {
      key: 'drawing_number',
      label: '図面番号',
      width: 150,
      sortable: true,
      editable: true,
      locked: false,
      inputType: 'text',
      sortType: 'string',
    },
    {
      key: 'external_drawing_number',
      label: '外部図面番号',
      width: 150,
      sortable: true,
      editable: true,
      locked: false,
      inputType: 'text',
      sortType: 'string',
    },
    {
      key: 'is_shown_similar_search',
      label: '類似検索表示',
      width: 120,
      sortable: true,
      editable: true,
      locked: false,
      inputType: 'select',
      selectOptions: [
        { label: '表示', color: 'green' },
        { label: '非表示', color: 'gray' },
      ],
      sortType: 'string',
    },
    {
      key: 's3_url',
      label: 'S3 URL',
      width: 200,
      sortable: false,
      editable: true,
      locked: false,
      inputType: 'text',
      render: (blueprint: DrawingPageBaseDataInterface, value: unknown) =>
        value ? (
          <a
            href={String(value)}
            target='_blank'
            rel='noopener noreferrer'
            className='text-sm text-blue-600 underline hover:text-blue-800'
          >
            ファイルを開く
          </a>
        ) : (
          <span className='text-sm text-gray-400'>未入力</span>
        ),
    },
    {
      key: 'remarks',
      label: '備考',
      width: 200,
      sortable: false,
      editable: true,
      locked: false,
      inputType: 'text',
    },
    {
      key: 'drawing_file_name',
      label: 'ファイル名',
      width: 200,
      sortable: true,
      editable: true,
      locked: false,
      inputType: 'text',
      sortType: 'string',
    },
    {
      key: 'drawing_file_extension',
      label: '拡張子',
      width: 80,
      sortable: true,
      editable: true,
      locked: false,
      inputType: 'select',
      selectOptions: [
        { label: 'dwg', color: 'blue' },
        { label: 'dxf', color: 'green' },
        { label: 'pdf', color: 'red' },
        { label: 'step', color: 'purple' },
        { label: 'iges', color: 'orange' },
      ],
      sortType: 'string',
    },
    {
      key: 'leaf_product_name',
      label: '製品名',
      width: 180,
      sortable: true,
      editable: false,
      locked: false,
      sortType: 'string',
    },
    {
      key: 'leaf_product_revision_number',
      label: 'リビジョン番号',
      width: 120,
      sortable: true,
      editable: true,
      locked: false,
      inputType: 'number',
      sortType: 'number',
    },
    {
      key: 'customer_name',
      label: '顧客名',
      width: 180,
      sortable: true,
      editable: false,
      locked: false,
      sortType: 'string',
    },
    {
      key: 'company_name',
      label: '会社名',
      width: 150,
      sortable: true,
      editable: false,
      locked: false,
      sortType: 'string',
    },
    {
      key: 'drawing_category_name',
      label: '図面カテゴリ',
      width: 120,
      sortable: true,
      editable: false,
      locked: false,
      sortType: 'string',
    },
    {
      key: 'created_by_name',
      label: '作成者名',
      width: 120,
      sortable: true,
      editable: false,
      locked: true,
      sortType: 'string',
    },
    {
      key: 'updated_by_name',
      label: '更新者名',
      width: 120,
      sortable: true,
      editable: false,
      locked: true,
      sortType: 'string',
    },
    {
      key: 'drawing_page_custom_items.材質.value',
      label: '材質',
      width: 100,
      sortable: true,
      editable: true,
      locked: false,
      inputType: 'select',
      selectOptions: [
        { label: 'S45C', color: 'blue' },
        { label: 'SUS304', color: 'green' },
        { label: 'A5052', color: 'purple' },
        { label: 'SS400', color: 'orange' },
        { label: 'SCM440', color: 'red' },
      ],
      sortType: 'string',
    },
    {
      key: 'drawing_page_custom_items.表面処理.value',
      label: '表面処理',
      width: 120,
      sortable: true,
      editable: true,
      locked: false,
      inputType: 'select',
      selectOptions: [
        { label: '亜鉛めっき', color: 'blue' },
        { label: 'ニッケルめっき', color: 'green' },
        { label: 'クロムめっき', color: 'purple' },
        { label: '無処理', color: 'gray' },
        { label: '陽極酸化', color: 'orange' },
      ],
      sortType: 'string',
    },
    {
      key: 'drawing_page_custom_items.公差.value',
      label: '公差',
      width: 100,
      sortable: true,
      editable: true,
      locked: false,
      inputType: 'text',
      sortType: 'string',
    },
    {
      key: 'drawing_page_custom_items.熱処理.value',
      label: '熱処理',
      width: 120,
      sortable: true,
      editable: true,
      locked: false,
      inputType: 'select',
      selectOptions: [
        { label: '調質', color: 'blue' },
        { label: '焼入れ', color: 'red' },
        { label: '焼なまし', color: 'orange' },
        { label: '残留応力除去', color: 'green' },
        { label: '無処理', color: 'gray' },
      ],
      sortType: 'string',
    },
    {
      key: 'drawing_page_custom_items.検査レベル.value',
      label: '検査レベル',
      width: 100,
      sortable: true,
      editable: true,
      locked: false,
      inputType: 'select',
      selectOptions: [
        { label: 'A', color: 'green' },
        { label: 'B', color: 'yellow' },
        { label: 'C', color: 'orange' },
        { label: '特級', color: 'red' },
      ],
      sortType: 'string',
    },
    {
      key: 'created_at',
      label: '作成日',
      width: 160,
      sortable: true,
      editable: false,
      locked: false,
      sortType: 'date',
    },
    {
      key: 'updated_at',
      label: '更新日時',
      width: 160,
      sortable: true,
      editable: false,
      locked: false,
      sortType: 'date',
    },
  ],

  pagination: {
    enabled: true,
    defaultItemsPerPage: 20,
    allowedItemsPerPage: [5, 10, 20, 50],
    showItemsPerPageSelector: true,
    maxVisiblePages: 5,
  },
});
