import React from 'react';
import Link from 'next/link';
import { ExternalLink, MoreHorizontal, Trash2 } from 'lucide-react';
import { Button, TableViewConfig, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/shared';
import { Specification, SpecificationColumnCallbacks } from '../model';

export const createSpecificationTableConfig = (
  callbacks: SpecificationColumnCallbacks = {}
): TableViewConfig<Specification> => ({
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
      render: (specification: Specification) => (
        <Link href={`/document/specification/${specification.id}`}>
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
      render: (specification: Specification, value: unknown) => (
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
      render: (specification: Specification, value: unknown) => (
        <div className="text-sm text-gray-800">
          {String(value)}
        </div>
      ),
    },
    {
      key: 'blueprint_name',
      label: '図面名',
      width: 180,
      sortable: true,
      editable: false,
      locked: false,
      sortType: 'string',
      render: (specification: Specification, value: unknown) => (
        <div className="text-sm text-gray-800">
          {String(value)}
        </div>
      ),
    },
    {
      key: 'version',
      label: 'バージョン',
      width: 100,
      sortable: true,
      editable: false,
      locked: false,
      sortType: 'string',
      render: (specification: Specification, value: unknown) => (
        <div className="text-sm text-gray-800">
          {String(value)}
        </div>
      ),
    },
    {
      key: 'approval_status',
      label: '承認状況',
      width: 120,
      sortable: true,
      editable: false,
      locked: false,
      sortType: 'string',
      render: (specification: Specification, value: unknown) => {
        const status = String(value);
        const statusColor = status === '承認済み' 
          ? 'bg-green-100 text-green-800' 
          : status === '差し戻し'
          ? 'bg-red-100 text-red-800'
          : 'bg-yellow-100 text-yellow-800';
          
        return (
          <span className={`px-2 py-1 text-xs rounded-full ${statusColor}`}>
            {status}
          </span>
        );
      }
    },
    {
      key: 'created_at',
      label: '作成日',
      width: 120,
      sortable: true,
      editable: false,
      locked: false,
      sortType: 'date',
      render: (specification: Specification, value: unknown) => (
        <div className="text-sm text-gray-600">
          {value ? new Date(String(value)).toLocaleDateString('ja-JP') : '-'}
        </div>
      )
    },
    {
      key: 'updated_at',
      label: '更新日',
      width: 120,
      sortable: true,
      editable: false,
      locked: false,
      sortType: 'date',
      render: (specification: Specification, value: unknown) => (
        <div className="text-sm text-gray-600">
          {value ? new Date(String(value)).toLocaleDateString('ja-JP') : '-'}
        </div>
      )
    },
    {
      key: 'actions',
      label: '操作',
      width: 80,
      minWidth: 80,
      sortable: false,
      editable: false,
      locked: false,
      render: (specification: Specification) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem 
              className="text-red-600"
              onClick={() => callbacks?.onDelete?.(specification)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              削除
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    }
  ],
  pagination: {
    enabled: true,
    defaultItemsPerPage: 20,
    allowedItemsPerPage: [10, 20, 50, 100],
    showItemsPerPageSelector: true,
    maxVisiblePages: 7,
  },
});