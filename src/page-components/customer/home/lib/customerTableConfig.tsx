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
} from '@/shared';
import { CustomerHomeDataInterface } from '@/dummy-data-er-fix/customer';
import { CustomerColumnCallbacks } from '../model/type';

export const createCustomerTableConfig = (
  callbacks: CustomerColumnCallbacks = {},
): TableViewConfig<CustomerHomeDataInterface> => ({
  columns: [
    {
      key: 'detail',
      label: '詳細',
      width: 80,
      minWidth: 0,
      sortable: false,
      editable: true,
      locked: true,
      stickyLeft: 0,
      render: (customer: CustomerHomeDataInterface) => (
        <Link href={`/customer/${customer.id}`}>
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
      key: 'seq_num',
      label: '取引先ID',
      width: 120,
      sortable: true,
      editable: true,
      locked: false,
      inputType: 'number',
      sortType: 'number',
    },
    {
      key: 'name',
      label: '取引先名',
      width: 250,
      sortable: true,
      editable: true,
      locked: false,
      inputType: 'text',
      sortType: 'string',
    },
    {
      key: 'name_kana',
      label: '取引先名（カナ）',
      width: 180,
      sortable: true,
      editable: true,
      locked: false,
      inputType: 'text',
      sortType: 'string',
    },
    {
      key: 'customer_status',
      label: 'ステータス',
      width: 150,
      sortable: true,
      editable: true,
      locked: false,
      inputType: 'select',
      sortType: 'string',
      selectOptions: [
        { label: '既存顧客', color: 'green' },
        { label: '見込み客', color: 'yellow' },
        { label: 'VIP顧客', color: 'purple' },
      ],
    },
    {
      key: 'customer_custom_items.業界分類.value',
      label: '業界分類',
      width: 120,
      sortable: true,
      editable: true,
      locked: false,
      inputType: 'select',
      sortType: 'string',
      selectOptions: [
        { label: '精密機械', color: 'blue' },
        { label: '建設業', color: 'orange' },
        { label: '電子部品', color: 'purple' },
        { label: '食品製造', color: 'yellow' },
        { label: '医療機器', color: 'red' },
        { label: '航空宇宙', color: 'indigo' },
        { label: '商社', color: 'slate' },
        { label: '自動車部品', color: 'emerald' },
        { label: '電子機器', color: 'pink' },
      ],
    },
    {
      key: 'customer_custom_items.契約形態.value',
      label: '契約形態',
      width: 120,
      sortable: true,
      editable: true,
      locked: false,
      inputType: 'select',
      sortType: 'string',
      selectOptions: [
        { label: 'スポット契約', color: 'gray' },
        { label: '年間契約', color: 'green' },
        { label: '継続契約', color: 'emerald' },
        { label: '季節契約', color: 'pink' },
        { label: 'プロジェクト契約', color: 'sky' },
        { label: '包括契約', color: 'purple' },
        { label: '開発契約', color: 'indigo' },
      ],
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
      key: 'actions',
      label: '操作',
      width: 80,
      minWidth: 80,
      sortable: false,
      editable: true,
      locked: false,
      stickyRight: 0,
      render: (customer: CustomerHomeDataInterface) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' size='sm'>
              <MoreHorizontal className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuItem
              className='text-red-600'
              onClick={() => callbacks?.onDelete?.(customer)}
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
