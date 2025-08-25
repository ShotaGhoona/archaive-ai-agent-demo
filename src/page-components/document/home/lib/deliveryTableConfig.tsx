import React from 'react';
import Link from 'next/link';
import { Button, TableViewConfig } from '@/shared';
import { ExternalLink } from 'lucide-react';
import { Delivery } from '../model';

export const createDeliveryTableConfig = (): TableViewConfig<Delivery> => ({
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
      render: (delivery: Delivery) => (
        <Link href={`/document/delivery/${delivery.id}`}>
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
      key: 'delivery_destination',
      label: '納品先',
      width: 150,
      sortable: true,
      editable: false,
      locked: false,
      sortType: 'string',
    },
    {
      key: 'delivery_date',
      label: '納品日',
      width: 120,
      sortable: true,
      editable: false,
      locked: false,
      sortType: 'date',
      render: (delivery: Delivery, value: unknown) => (
        <span className="text-sm">
          {value ? new Date(String(value)).toLocaleDateString('ja-JP') : '-'}
        </span>
      ),
    },
    {
      key: 'inspection_scheduled_date',
      label: '検収予定日',
      width: 120,
      sortable: true,
      editable: false,
      locked: false,
      sortType: 'date',
      render: (delivery: Delivery, value: unknown) => (
        <span className="text-sm">
          {value ? new Date(String(value)).toLocaleDateString('ja-JP') : '-'}
        </span>
      ),
    },
    {
      key: 'inspection_status',
      label: '検収状況',
      width: 100,
      sortable: true,
      editable: false,
      locked: false,
      sortType: 'string',
      render: (delivery: Delivery, value: unknown) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === '検収完了' ? 'bg-green-100 text-green-800' :
          value === '検収待ち' ? 'bg-yellow-100 text-yellow-800' :
          'bg-gray-100 text-gray-800'
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
      render: (delivery: Delivery, value: unknown) => (
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