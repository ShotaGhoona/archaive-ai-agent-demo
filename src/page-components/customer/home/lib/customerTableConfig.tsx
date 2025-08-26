import React from 'react';
import Link from 'next/link';
import { ExternalLink, MoreHorizontal, Trash2 } from 'lucide-react';
import { Button, TableViewConfig, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/shared';
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
      key: 'name',
      label: '顧客名',
      width: 300,
      sortable: true,
      editable: false,
      locked: false,
      sortType: 'string',
      render: (customer: Customer, value: unknown) => (
        <div className="font-medium text-gray-900">
          {String(value)}
        </div>
      ),
    },
    {
      key: 'updated_at',
      label: '最終更新日',
      width: 150,
      sortable: true,
      editable: false,
      locked: false,
      sortType: 'date',
      render: (customer: Customer, value: unknown) => (
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

