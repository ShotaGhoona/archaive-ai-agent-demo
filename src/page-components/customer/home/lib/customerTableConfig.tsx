import React from 'react';
import Link from 'next/link';
import { ExternalLink, MoreHorizontal, Trash2 } from 'lucide-react';
import { Button, TableViewConfig, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, Badge } from '@/shared';
import { Customer } from '../model/type';

export interface CustomerColumnCallbacks {
  onDelete?: (customer: Customer) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'アクティブ': return 'bg-green-100 text-green-800';
    case '非アクティブ': return 'bg-gray-100 text-gray-800';
    case '休止中': return 'bg-yellow-100 text-yellow-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

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
      render: (customer: Customer, value: unknown) => (
        <span className="font-mono text-sm font-medium">
          {String(value)}
        </span>
      ),
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
        '製造業',
        '建設業',
        '電子部品製造業',
        '食品製造業',
        '医療機器製造業',
        '航空宇宙産業',
        '商社',
        '自動車部品製造業',
        '精密機械製造業',
        '電子機器製造業',
      ],
      render: (customer: Customer, value: unknown) => (
        <Badge className="bg-blue-100 text-blue-800">
          {String(value)}
        </Badge>
      ),
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
      selectOptions: ['アクティブ', '非アクティブ', '休止中'],
      render: (customer: Customer, value: unknown) => (
        <Badge className={getStatusColor(String(value))}>
          {String(value)}
        </Badge>
      ),
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
      render: (customer: Customer, value: unknown) => (
        <span className={`text-sm font-mono ${value ? 'text-gray-900' : 'text-gray-400'}`}>
          {value ? `¥${Number(value).toLocaleString()}` : '未入力'}
        </span>
      ),
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
      render: (customer: Customer, value: unknown) => (
        <span className={`text-sm ${value ? 'text-gray-900' : 'text-gray-400'}`}>
          {value ? `${Number(value)}名` : '未入力'}
        </span>
      ),
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
      render: (customer: Customer, value: unknown) => (
        <span className={`text-sm ${value ? 'text-gray-600' : 'text-gray-400'}`}>
          {value || '未入力'}
        </span>
      ),
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
      inputType: 'textarea',
      render: (customer: Customer, value: unknown) => (
        <span className={`text-sm max-w-[200px] truncate ${value ? 'text-gray-700' : 'text-gray-400'}`} title={String(value || '')}>
          {value || '未入力'}
        </span>
      ),
    },
    {
      key: 'created_at',
      label: '作成日時',
      width: 160,
      sortable: true,
      editable: false,
      locked: true,
      sortType: 'date',
      render: (customer: Customer, value: unknown) => (
        <span className="text-gray-600">
          {new Date(String(value)).toLocaleString('ja-JP', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      ),
    },
    {
      key: 'updated_at',
      label: '最終更新日時',
      width: 160,
      sortable: true,
      editable: false,
      locked: true,
      sortType: 'date',
      render: (customer: Customer, value: unknown) => (
        <span className="text-gray-600">
          {new Date(String(value)).toLocaleString('ja-JP', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      ),
    },
    {
      key: 'actions',
      label: '操作',
      width: 80,
      minWidth: 80,
      sortable: false,
      editable: false,
      locked: false,
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

