import React from 'react';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { Button, TableViewConfig } from '@/shared';

export interface Customer {
  id: number;
  company_id: number;
  name: string;
  created_at: string;
  updated_at: string;
}


// 顧客管理用のコールバック型
export interface CustomerColumnCallbacks {
  onEdit?: (customer: Customer) => void;
  onDelete?: (customer: Customer) => void;
}

export const createCustomerTableConfig = (): TableViewConfig<Customer> => ({
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
      editable: true,
      locked: false,
      inputType: 'text',
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
  ],
  pagination: {
    enabled: true,
    defaultItemsPerPage: 20,
    allowedItemsPerPage: [10, 20, 50, 100],
    showItemsPerPageSelector: true,
    maxVisiblePages: 7,
  },
});

