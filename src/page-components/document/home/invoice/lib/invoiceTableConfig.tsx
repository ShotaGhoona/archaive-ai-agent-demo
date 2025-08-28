import React from 'react';
import Link from 'next/link';
import { ExternalLink, MoreHorizontal, Trash2 } from 'lucide-react';
import { Button, TableViewConfig, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, SelectOption } from '@/shared';
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
    },
    {
      key: 'project_name',
      label: 'プロジェクト名',
      width: 180,
      sortable: true,
      editable: false,
      locked: false,
      sortType: 'string',
    },
    {
      key: 'billing_destination',
      label: '請求先',
      width: 180,
      sortable: true,
      editable: false,
      locked: false,
      sortType: 'string',
    },
    {
      key: 'billing_amount',
      label: '請求金額',
      width: 140,
      sortable: true,
      editable: false,
      locked: false,
      sortType: 'number',
      inputType: 'number',
    },
    {
      key: 'billing_date',
      label: '請求日',
      width: 120,
      sortable: true,
      editable: false,
      locked: false,
      sortType: 'date',
      inputType: 'date',
    },
    {
      key: 'payment_due_date',
      label: '支払期限',
      width: 120,
      sortable: true,
      editable: false,
      locked: false,
      sortType: 'date',
      inputType: 'date',
    },
    {
      key: 'payment_status',
      label: '支払状況',
      width: 120,
      sortable: true,
      editable: false,
      locked: false,
      sortType: 'string',
      inputType: 'select',
      selectOptions: [
        { label: '支払済み', color: 'green' },
        { label: '未払い', color: 'red' },
        { label: '部分支払', color: 'yellow' }
      ] as SelectOption[],
    },
    {
      key: 'updated_at',
      label: '最終更新日',
      width: 130,
      sortable: true,
      editable: false,
      locked: false,
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