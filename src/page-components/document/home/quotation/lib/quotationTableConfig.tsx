import React from 'react';
import Link from 'next/link';
import { ExternalLink, MoreHorizontal, Trash2 } from 'lucide-react';
import { Button, TableViewConfig, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/shared';
import { Quotation, QuotationColumnCallbacks } from '../model';


export const createQuotationTableConfig = (callbacks: QuotationColumnCallbacks = {}): TableViewConfig<Quotation> => ({
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
      render: (quotation: Quotation) => (
        <Link href={`/document/quotation/${quotation.id}`}>
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
      width: 250,
      sortable: true,
      editable: false,
      locked: false,
      sortType: 'string',
      render: (quotation: Quotation, value: unknown) => (
        <div className="font-medium text-gray-900">
          {String(value)}
        </div>
      ),
    },
    {
      key: 'project_name',
      label: '案件名',
      width: 250,
      sortable: true,
      editable: false,
      locked: false,
      sortType: 'string',
      render: (quotation: Quotation, value: unknown) => (
        <div className="text-sm text-gray-800">
          {String(value)}
        </div>
      ),
    },
    {
      key: 'customer_name',
      label: '顧客名',
      width: 200,
      sortable: true,
      editable: false,
      locked: false,
      sortType: 'string',
      render: (quotation: Quotation, value: unknown) => (
        <div className="text-sm text-gray-800">
          {String(value)}
        </div>
      ),
    },
    {
      key: 'amount',
      label: '見積金額',
      width: 150,
      sortable: true,
      editable: false,
      locked: false,
      sortType: 'number',
      render: (quotation: Quotation, value: unknown) => (
        <div className="text-sm text-gray-900 font-medium">
          ¥{Number(value).toLocaleString()}
        </div>
      ),
    },
    {
      key: 'quotation_date',
      label: '見積日',
      width: 120,
      sortable: true,
      editable: false,
      locked: false,
      sortType: 'date',
      render: (quotation: Quotation, value: unknown) => (
        <div className="text-sm text-gray-600">
          {value ? new Date(String(value)).toLocaleDateString('ja-JP') : '-'}
        </div>
      ),
    },
    {
      key: 'expiry_date',
      label: '有効期限',
      width: 120,
      sortable: true,
      editable: false,
      locked: false,
      sortType: 'date',
      render: (quotation: Quotation, value: unknown) => (
        <div className="text-sm text-gray-600">
          {value ? new Date(String(value)).toLocaleDateString('ja-JP') : '-'}
        </div>
      ),
    },
    {
      key: 'approval_status',
      label: '承認状況',
      width: 100,
      sortable: true,
      editable: false,
      locked: false,
      sortType: 'string',
      render: (quotation: Quotation, value: unknown) => {
        const status = String(value);
        const statusColor = status === '承認済み' 
          ? 'bg-green-100 text-green-800' 
          : status === '却下'
          ? 'bg-red-100 text-red-800'
          : 'bg-yellow-100 text-yellow-800';
          
        return (
          <span className={`px-2 py-1 text-xs rounded-full ${statusColor}`}>
            {status}
          </span>
        );
      },
    },
    {
      key: 'updated_at',
      label: '最終更新日',
      width: 150,
      sortable: true,
      editable: false,
      locked: false,
      sortType: 'date',
      render: (quotation: Quotation, value: unknown) => (
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
      render: (quotation: Quotation) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem 
              className="text-red-600"
              onClick={() => callbacks?.onDelete?.(quotation)}
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