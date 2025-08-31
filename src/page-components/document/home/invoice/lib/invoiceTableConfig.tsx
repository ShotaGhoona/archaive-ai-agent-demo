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
import { DocumentInvoiceDataInterface } from '@/dummy-data-er-fix/document';
import { InvoiceColumnCallbacks } from '../model';

export const createInvoiceTableConfig = (
  callbacks: InvoiceColumnCallbacks = {},
): TableViewConfig<DocumentInvoiceDataInterface> => ({
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
      render: (invoice: DocumentInvoiceDataInterface) => (
        <Link href={`/document/invoice/${invoice.id}`}>
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
      key: 'directory_document_custom_items.請求書番号.value',
      label: '請求書番号',
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
      key: 'directory_document_custom_items.請求日.value',
      label: '請求日',
      width: 120,
      sortable: true,
      editable: true,
      locked: false,
      sortType: 'date',
      inputType: 'date',
    },
    {
      key: 'directory_document_custom_items.支払条件.value',
      label: '支払条件',
      width: 180,
      sortable: true,
      editable: true,
      locked: false,
      inputType: 'select',
      sortType: 'string',
      selectOptions: [
        { label: '月末締め翌月末払い', color: 'blue' },
        { label: '翌月15日払い', color: 'green' },
        { label: '60日後払い', color: 'yellow' },
        { label: '即日払い', color: 'red' },
        { label: '分割払い可', color: 'purple' },
        { label: '前払い', color: 'orange' },
        { label: '現金決済', color: 'indigo' },
        { label: '手形決済', color: 'sky' },
        { label: '振込決済', color: 'emerald' },
        { label: '小切手決済', color: 'pink' },
      ],
    },
    {
      key: 'directory_document_custom_items.請求金額.value',
      label: '請求金額',
      width: 150,
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
      render: (invoice: DocumentInvoiceDataInterface) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' size='sm'>
              <MoreHorizontal className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuItem
              className='text-red-600'
              onClick={() => callbacks?.onDelete?.(invoice)}
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
