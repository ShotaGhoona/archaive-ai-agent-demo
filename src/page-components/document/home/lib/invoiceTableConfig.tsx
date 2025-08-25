import React from 'react';
import Link from 'next/link';
import { Button, TableViewConfig } from '@/shared';
import { ExternalLink } from 'lucide-react';
import { Invoice } from '../model';

export const createInvoiceTableConfig = (): TableViewConfig<Invoice> => ({
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
      label: '案件名',
      width: 200,
      sortable: true,
      editable: false,
      locked: false,
      sortType: 'string',
    },
    {
      key: 'billing_destination',
      label: '請求先',
      width: 150,
      sortable: true,
      editable: false,
      locked: false,
      sortType: 'string',
    },
    {
      key: 'billing_amount',
      label: '請求金額',
      width: 120,
      sortable: true,
      editable: false,
      locked: false,
      sortType: 'number',
      render: (invoice: Invoice, value: unknown) => (
        <span className="font-medium">
          ¥{Number(value).toLocaleString()}
        </span>
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
        <span className="text-sm">
          {value ? new Date(String(value)).toLocaleDateString('ja-JP') : '-'}
        </span>
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
        <span className="text-sm">
          {value ? new Date(String(value)).toLocaleDateString('ja-JP') : '-'}
        </span>
      ),
    },
    {
      key: 'payment_status',
      label: '支払状況',
      width: 100,
      sortable: true,
      editable: false,
      locked: false,
      sortType: 'string',
      render: (invoice: Invoice, value: unknown) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === '支払済み' ? 'bg-green-100 text-green-800' :
          'bg-red-100 text-red-800'
        }`}>
          {String(value)}
        </span>
      ),
    },
    {
      key: 'created_at',
      label: '作成日',
      width: 120,
      sortable: true,
      editable: false,
      locked: false,
      sortType: 'date',
      render: (invoice: Invoice, value: unknown) => (
        <span className="text-sm text-gray-600">
          {value ? new Date(String(value)).toLocaleDateString('ja-JP') : '-'}
        </span>
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