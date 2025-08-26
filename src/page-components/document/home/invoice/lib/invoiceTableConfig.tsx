import React from 'react';
import Link from 'next/link';
import { ExternalLink, MoreHorizontal, Trash2 } from 'lucide-react';
import { Button, TableViewConfig, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/shared';
import { Invoice, InvoiceColumnCallbacks } from '../model';

export const createInvoiceTableConfig = (callbacks: InvoiceColumnCallbacks = {}): TableViewConfig<Invoice> => ({
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
      render: (invoice: Invoice) => (
        <Link href={`/document/invoice/${invoice.id}`}>
          <Button size="sm" variant="outline" className="h-8 text-primary font-bold hover:text-primary/80">
            <ExternalLink className="h-3 w-3" />
            開く
          </Button>
        </Link>
      ),
    },
    {
      key: 'name',
      label: '帳票名',
      width: 200,
      sortable: true,
      editable: false,
      locked: false,
      sortType: 'string',
      render: (invoice: Invoice, value: unknown) => (
        <div className="font-medium text-gray-900">
          {String(value)}
        </div>
      ),
    },
    {
      key: 'project_name',
      label: 'プロジェクト名',
      width: 180,
      sortable: true,
      editable: false,
      locked: false,
      sortType: 'string',
      render: (invoice: Invoice, value: unknown) => (
        <div className="text-sm text-gray-800">
          {String(value)}
        </div>
      ),
    },
    {
      key: 'billing_destination',
      label: '請求先',
      width: 180,
      sortable: true,
      editable: false,
      locked: false,
      sortType: 'string',
      render: (invoice: Invoice, value: unknown) => (
        <div className="text-sm text-gray-800">
          {String(value)}
        </div>
      ),
    },
    {
      key: 'billing_amount',
      label: '請求金額',
      width: 140,
      sortable: true,
      editable: false,
      locked: false,
      sortType: 'number',
      render: (invoice: Invoice, value: unknown) => (
        <div className="text-sm text-gray-900 font-medium">
          ¥{Number(value).toLocaleString()}
        </div>
      ),
    },
    {
      key: 'billing_date',
      label: '請求日',
      width: 120,
      sortable: true,
      editable: false,
      locked: false,
      sortType: 'date',
      render: (invoice: Invoice, value: unknown) => (
        <div className="text-sm text-gray-600">
          {value ? new Date(String(value)).toLocaleDateString('ja-JP') : '-'}
        </div>
      ),
    },
    {
      key: 'payment_due_date',
      label: '支払期限',
      width: 120,
      sortable: true,
      editable: false,
      locked: false,
      sortType: 'date',
      render: (invoice: Invoice, value: unknown) => (
        <div className="text-sm text-gray-600">
          {value ? new Date(String(value)).toLocaleDateString('ja-JP') : '-'}
        </div>
      ),
    },
    {
      key: 'payment_status',
      label: '支払状況',
      width: 120,
      sortable: true,
      editable: false,
      locked: false,
      sortType: 'string',
      render: (invoice: Invoice, value: unknown) => {
        const status = String(value);
        const getStatusColor = (status: string) => {
          switch (status) {
            case '支払済み': return 'bg-green-100 text-green-800';
            case '未払い': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
          }
        };
        return (
          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(status)}`}>
            {status}
          </span>
        );
      },
    },
    {
      key: 'updated_at',
      label: '最終更新日',
      width: 130,
      sortable: true,
      editable: false,
      locked: false,
      sortType: 'date',
      render: (invoice: Invoice, value: unknown) => (
        <div className="text-sm text-gray-600">
          {value ? new Date(String(value)).toLocaleDateString('ja-JP') : '-'}
        </div>
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
      render: (invoice: Invoice) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem 
              className="text-red-600"
              onClick={() => callbacks?.onDelete?.(invoice)}
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