import Link from 'next/link';
import { Button, TableViewConfig } from '@/shared';
import { Specification, SpecificationColumnCallbacks } from '../model';
import { Trash2 } from 'lucide-react';

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
          <Button size="sm" variant="outline" className="h-8 text-xs">
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
      sortType: 'string'
    },
    {
      key: 'project_name', 
      label: 'プロジェクト名',
      width: 180,
      sortable: true,
      editable: false,
      locked: false,
      sortType: 'string'
    },
    {
      key: 'blueprint_name',
      label: '図面名',
      width: 180,
      sortable: true,
      editable: false,
      locked: false,
      sortType: 'string'
    },
    {
      key: 'version',
      label: 'バージョン',
      width: 100,
      sortable: true,
      editable: false,
      locked: false,
      sortType: 'string'
    },
    {
      key: 'approval_status',
      label: '承認状況',
      width: 120,
      sortable: true,
      editable: false,
      locked: false,
      sortType: 'string',
      render: (specification: Specification) => {
        const getStatusColor = (status: string) => {
          switch (status) {
            case '承認済み': return 'text-green-600 bg-green-50';
            case '未承認': return 'text-yellow-600 bg-yellow-50';
            case '差し戻し': return 'text-red-600 bg-red-50';
            default: return 'text-gray-600 bg-gray-50';
          }
        };
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            getStatusColor(specification.approval_status)
          }`}>
            {specification.approval_status}
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
      render: (specification: Specification) => new Date(specification.created_at).toLocaleDateString('ja-JP')
    },
    {
      key: 'updated_at',
      label: '更新日',
      width: 120,
      sortable: true,
      editable: false,
      locked: false,
      sortType: 'date',
      render: (specification: Specification) => new Date(specification.updated_at).toLocaleDateString('ja-JP')
    },
    {
      key: 'actions',
      label: 'アクション',
      width: 100,
      minWidth: 0,
      sortable: false,
      editable: false,
      locked: true,
      stickyRight: 0,
      render: (specification: Specification) => (
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={() => callbacks.onDelete?.(specification)}
            title="削除"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
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