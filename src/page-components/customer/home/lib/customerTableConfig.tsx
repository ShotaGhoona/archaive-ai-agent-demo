import React from 'react';
import Link from 'next/link';
import { ExternalLink, MoreHorizontal, Trash2 } from 'lucide-react';
import { Button, TableViewConfig, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, Badge } from '@/shared';
import { Customer } from '../model/type';

export interface CustomerColumnCallbacks {
  onDelete?: (customer: Customer) => void;
}


export const createCustomerTableConfig = (callbacks: CustomerColumnCallbacks = {}): TableViewConfig<Customer> => ({
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
      render: (customer: Customer) => (
        <Link href={`/customer/${customer.id}`}>
          <Button size="sm" variant="outline" className="h-8 text-primary font-bold hover:text-primary/80">
            <ExternalLink className="h-3 w-3" />
            開く
          </Button>
        </Link>
      ),
    },
    {
      key: 'account_id',
      label: '取引先ID',
      width: 120,
      sortable: true,
      editable: true,
      locked: false,
      inputType: 'text',
      sortType: 'string',
    },
    {
      key: 'account_name',
      label: '取引先名',
      width: 250,
      sortable: true,
      editable: true,
      locked: false,
      inputType: 'text',
      sortType: 'string',
    },
    {
      key: 'account_type',
      label: '取引先種別',
      width: 150,
      sortable: true,
      editable: true,
      locked: false,
      inputType: 'select',
      sortType: 'string',
      selectOptions: [
        { label: '製造業', color: 'blue' },
        { label: '建設業', color: 'green' },
        { label: '電子部品製造業', color: 'purple' },
        { label: '食品製造業', color: 'orange' },
        { label: '医療機器製造業', color: 'red' },
        { label: '航空宇宙産業', color: 'indigo' },
        { label: '商社', color: 'yellow' },
        { label: '自動車部品製造業', color: 'emerald' },
        { label: '精密機械製造業', color: 'sky' },
        { label: '電子機器製造業', color: 'pink' },
      ],
    },
    {
      key: 'status',
      label: 'ステータス',
      width: 100,
      sortable: true,
      editable: true,
      locked: false,
      inputType: 'select',
      sortType: 'string',
      selectOptions: [
        { label: 'アクティブ', color: 'green' },
        { label: '非アクティブ', color: 'gray' },
        { label: '休止中', color: 'yellow' },
      ],
    },
    {
      key: 'annual_revenue',
      label: '年間売上高',
      width: 120,
      sortable: true,
      editable: true,
      locked: false,
      inputType: 'number',
      sortType: 'number',
    },
    {
      key: 'employee_count',
      label: '従業員数',
      width: 100,
      sortable: true,
      editable: true,
      locked: false,
      inputType: 'number',
      sortType: 'number',
    },
    {
      key: 'account_name_kana',
      label: '取引先名（カナ）',
      width: 180,
      sortable: true,
      editable: true,
      locked: false,
      inputType: 'text',
      sortType: 'string',
    },
    {
      key: 'website',
      label: 'Webサイト',
      width: 150,
      sortable: false,
      editable: true,
      locked: false,
      inputType: 'text',
      render: (customer: Customer, value: unknown) => (
        value ? (
          <a
            href={String(value)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 text-sm underline"
          >
            サイトを開く
          </a>
        ) : (
          <span className="text-sm text-gray-400">未入力</span>
        )
      ),
    },
    {
      key: 'description',
      label: '取引先概要',
      width: 200,
      sortable: false,
      editable: true,
      locked: false,
      inputType: 'text',
    },
    {
      key: 'created_at',
      label: '作成日時',
      width: 160,
      sortable: true,
      editable: false,
      locked: true,
      sortType: 'date',
    },
    {
      key: 'updated_at',
      label: '最終更新日時',
      width: 160,
      sortable: true,
      editable: false,
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
      render: (customer: Customer) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem 
              className="text-red-600"
              onClick={() => callbacks?.onDelete?.(customer)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
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

