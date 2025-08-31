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
import { DocumentDeliveryDataInterface } from '@/dummy-data-er-fix/document';
import { DeliveryColumnCallbacks } from '../model';

export const createDeliveryTableConfig = (
  callbacks: DeliveryColumnCallbacks = {},
): TableViewConfig<DocumentDeliveryDataInterface> => ({
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
      render: (delivery: DocumentDeliveryDataInterface) => (
        <Link href={`/document/delivery/${delivery.id}`}>
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
      key: 'directory_document_custom_items.納品書番号.value',
      label: '納品書番号',
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
      key: 'directory_document_custom_items.納品先.value',
      label: '納品先',
      width: 150,
      sortable: true,
      editable: true,
      locked: false,
      inputType: 'select',
      sortType: 'string',
      selectOptions: [
        { label: '本社工場', color: 'blue' },
        { label: '第二工場', color: 'green' },
        { label: '検査室', color: 'orange' },
        { label: '研究開発部', color: 'purple' },
        { label: '組立ライン', color: 'sky' },
        { label: '品質管理部', color: 'yellow' },
        { label: '製造現場', color: 'slate' },
        { label: '計測室', color: 'emerald' },
        { label: '電子回路部', color: 'pink' },
      ],
    },
    {
      key: 'directory_document_custom_items.納品日.value',
      label: '納品日',
      width: 120,
      sortable: true,
      editable: true,
      locked: false,
      sortType: 'date',
      inputType: 'date',
    },
    {
      key: 'directory_document_custom_items.品目・数量.value',
      label: '品目・数量',
      width: 200,
      sortable: true,
      editable: true,
      locked: false,
      inputType: 'text',
      sortType: 'string',
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
      render: (delivery: DocumentDeliveryDataInterface) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' size='sm'>
              <MoreHorizontal className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuItem
              className='text-red-600'
              onClick={() => callbacks?.onDelete?.(delivery)}
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
