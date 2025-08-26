import React from 'react';
import Link from 'next/link';
import { ExternalLink, MoreHorizontal, Trash2 } from 'lucide-react';
import { Button, TableViewConfig, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/shared';
import { Delivery, DeliveryColumnCallbacks } from '../model';

export const createDeliveryTableConfig = (callbacks: DeliveryColumnCallbacks = {}): TableViewConfig<Delivery> => ({
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
      render: (delivery: Delivery, value: unknown) => (
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
      render: (delivery: Delivery, value: unknown) => (
        <div className="text-sm text-gray-800">
          {String(value)}
        </div>
      ),
    },
    {
      key: 'delivery_destination',
      label: '納品先',
      width: 180,
      sortable: true,
      editable: false,
      locked: false,
      sortType: 'string',
      render: (delivery: Delivery, value: unknown) => (
        <div className="text-sm text-gray-800">
          {String(value)}
        </div>
      ),
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
        <div className="text-sm text-gray-600">
          {value ? new Date(String(value)).toLocaleDateString('ja-JP') : '-'}
        </div>
      ),
    },
    {
      key: 'inspection_scheduled_date',
      label: '検収予定日',
      width: 130,
      sortable: true,
      editable: false,
      locked: false,
      sortType: 'date',
      render: (delivery: Delivery, value: unknown) => (
        <div className="text-sm text-gray-600">
          {value ? new Date(String(value)).toLocaleDateString('ja-JP') : '-'}
        </div>
      ),
    },
    {
      key: 'inspection_status',
      label: '検収状況',
      width: 120,
      sortable: true,
      editable: false,
      locked: false,
      sortType: 'string',
      render: (delivery: Delivery, value: unknown) => {
        const status = String(value);
        const getStatusColor = (status: string) => {
          switch (status) {
            case '検収完了': return 'bg-green-100 text-green-800';
            case '検収待ち': return 'bg-yellow-100 text-yellow-800';
            case '未納品': return 'bg-gray-100 text-gray-800';
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
      render: (delivery: Delivery, value: unknown) => (
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
      render: (delivery: Delivery) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem 
              className="text-red-600"
              onClick={() => callbacks?.onDelete?.(delivery)}
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