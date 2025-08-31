import React from 'react';
import Link from 'next/link';
import { ExternalLink, MoreHorizontal, Trash2 } from 'lucide-react';
import {
  Button,
  TableViewConfig,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  SelectOption,
} from '@/shared';
import { DocumentOrderDataInterface } from '@/dummy-data-er-fix/document';
import { OrderColumnCallbacks } from '../model';

export const createOrderTableConfig = (
  callbacks: OrderColumnCallbacks = {},
): TableViewConfig<DocumentOrderDataInterface> => ({
  columns: [
    {
      key: 'detail',
      label: '詳細',
      width: 80,
      minWidth: 0,
      sortable: false,
      editable: false,
      locked: true,
      stickyLeft: 0,
      render: (order: DocumentOrderDataInterface) => (
        <Link href={`/document/order/${order.id}`}>
          <Button
            size='sm'
            variant='outline'
            className='text-primary hover:text-primary/80 h-8 font-bold'
          >
            <ExternalLink className='h-3 w-3' />
            開く
          </Button>
        </Link>
      ),
    },
    {
      key: 'directory_document_custom_items.受注番号.value',
      label: '受注番号',
      width: 150,
      sortable: true,
      editable: true,
      locked: false,
      inputType: 'text',
      sortType: 'string',
    },
    {
      key: 'directory_name',
      label: 'プロジェクト名',
      width: 250,
      sortable: true,
      editable: true,
      locked: false,
      inputType: 'text',
      sortType: 'string',
    },
    {
      key: 'customer_name',
      label: '顧客名',
      width: 200,
      sortable: true,
      editable: true,
      locked: false,
      inputType: 'text',
      sortType: 'string',
    },
    {
      key: 'directory_document_custom_items.受注日.value',
      label: '受注日',
      width: 120,
      sortable: true,
      editable: true,
      locked: false,
      sortType: 'date',
      inputType: 'date',
    },
    {
      key: 'directory_document_custom_items.発注区分.value',
      label: '発注区分',
      width: 150,
      sortable: true,
      editable: true,
      locked: false,
      inputType: 'select',
      sortType: 'string',
      selectOptions: [
        { label: '新規発注', color: 'blue' },
        { label: '開発案件', color: 'purple' },
        { label: '量産発注', color: 'green' },
        { label: '研究開発', color: 'indigo' },
        { label: 'システム発注', color: 'sky' },
        { label: '特注発注', color: 'orange' },
        { label: '大型システム', color: 'red' },
        { label: '設備発注', color: 'slate' },
        { label: '精密機器', color: 'emerald' },
        { label: 'カスタム発注', color: 'pink' },
      ],
    },
    {
      key: 'directory_document_custom_items.納期条件.value',
      label: '納期条件',
      width: 150,
      sortable: true,
      editable: true,
      locked: false,
      inputType: 'select',
      sortType: 'string',
      selectOptions: [
        { label: '指定日厳守', color: 'red' },
        { label: 'プロトタイプ優先', color: 'orange' },
        { label: '分割納期可', color: 'blue' },
        { label: '段階納期', color: 'yellow' },
        { label: '設置工事込み', color: 'green' },
        { label: '検査証明付き', color: 'purple' },
        { label: '段階検収', color: 'indigo' },
        { label: '分割納入可', color: 'sky' },
        { label: '校正証明必須', color: 'emerald' },
        { label: '動作確認済み', color: 'pink' },
      ],
    },
    {
      key: 'name',
      label: 'ドキュメント名',
      width: 220,
      sortable: true,
      editable: true,
      locked: false,
      inputType: 'text',
      sortType: 'string',
    },
    {
      key: 'version',
      label: 'バージョン',
      width: 100,
      sortable: true,
      editable: true,
      locked: false,
      inputType: 'number',
      sortType: 'number',
    },
    {
      key: 'created_by_name',
      label: '作成者',
      width: 120,
      sortable: true,
      editable: true,
      locked: false,
      inputType: 'user',
      sortType: 'string',
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
      key: 'created_at',
      label: '作成日時',
      width: 150,
      sortable: true,
      editable: true,
      locked: true,
      sortType: 'date',
    },
    {
      key: 'updated_at',
      label: '最終更新日時',
      width: 150,
      sortable: true,
      editable: true,
      locked: true,
      sortType: 'date',
    },
    {
      key: 'actions',
      label: '操作',
      width: 80,
      minWidth: 80,
      sortable: false,
      editable: false,
      locked: false,
      stickyRight: 0,
      render: (order: DocumentOrderDataInterface) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' size='sm'>
              <MoreHorizontal className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuItem
              className='text-red-600'
              onClick={() => callbacks?.onDelete?.(order)}
            >
              <Trash2 className='mr-2 h-4 w-4' />
              削除
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ],
  pagination: {
    enabled: true,
    defaultItemsPerPage: 20,
    allowedItemsPerPage: [10, 20, 50, 100],
    showItemsPerPageSelector: true,
    maxVisiblePages: 7,
  },
});
