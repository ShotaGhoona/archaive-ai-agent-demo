import React from 'react';
import Link from 'next/link';
import { ExternalLink, MoreHorizontal, Trash2 } from 'lucide-react';
import { Button, TableViewConfig, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, SelectOption } from '@/shared';
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
    },
    {
      key: 'project_name',
      label: '案件名',
      width: 250,
      sortable: true,
      editable: false,
      locked: false,
      sortType: 'string',
    },
    {
      key: 'customer_name',
      label: '顧客名',
      width: 200,
      sortable: true,
      editable: false,
      locked: false,
      sortType: 'string',
    },
    {
      key: 'amount',
      label: '見積金額',
      width: 150,
      sortable: true,
      editable: false,
      locked: false,
      sortType: 'number',
      inputType: 'number',
    },
    {
      key: 'quotation_date',
      label: '見積日',
      width: 120,
      sortable: true,
      editable: false,
      locked: false,
      sortType: 'date',
      inputType: 'date',
    },
    {
      key: 'expiry_date',
      label: '有効期限',
      width: 120,
      sortable: true,
      editable: false,
      locked: false,
      sortType: 'date',
      inputType: 'date',
    },
    {
      key: 'approval_status',
      label: '承認状況',
      width: 100,
      sortable: true,
      editable: false,
      locked: false,
      sortType: 'string',
      inputType: 'select',
      selectOptions: [
        { label: '承認済み', color: 'green' },
        { label: '却下', color: 'red' },
        { label: '承認待ち', color: 'yellow' }
      ] as SelectOption[],
    },
    {
      key: 'updated_at',
      label: '最終更新日',
      width: 150,
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