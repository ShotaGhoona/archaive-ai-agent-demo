import React from 'react';
import Link from 'next/link';
import { Button, TableViewConfig } from '@/shared';
import { ExternalLink } from 'lucide-react';
import { Specification } from '../model';

export const createSpecificationTableConfig = (): TableViewConfig<Specification> => ({
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
      key: 'blueprint_name',
      label: '図面名',
      width: 200,
      sortable: true,
      editable: false,
      locked: false,
      sortType: 'string',
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
        <span className="font-mono text-sm font-medium">
          {String(value)}
        </span>
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
      render: (specification: Specification, value: unknown) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === '承認済み' ? 'bg-green-100 text-green-800' :
          value === '差し戻し' ? 'bg-red-100 text-red-800' :
          'bg-yellow-100 text-yellow-800'
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
      render: (specification: Specification, value: unknown) => (
        <span className="text-sm text-gray-600">
          {value ? new Date(String(value)).toLocaleDateString('ja-JP') : '-'}
        </span>
      ),
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