import React from 'react';
import Link from 'next/link';
import { ExternalLink, MoreHorizontal, Trash2 } from 'lucide-react';
import { Button, TableViewConfig, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/shared';
import { Inspection, InspectionColumnCallbacks } from '../model';

export const createInspectionTableConfig = (callbacks: InspectionColumnCallbacks = {}): TableViewConfig<Inspection> => ({
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
      render: (inspection: Inspection) => (
        <Link href={`/document/inspection/${inspection.id}`}>
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
      render: (inspection: Inspection, value: unknown) => (
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
      render: (inspection: Inspection, value: unknown) => (
        <div className="text-sm text-gray-800">
          {String(value)}
        </div>
      ),
    },
    {
      key: 'inspection_items_count',
      label: '検査項目数',
      width: 120,
      sortable: true,
      editable: false,
      locked: false,
      sortType: 'number',
      render: (inspection: Inspection, value: unknown) => (
        <div className="text-sm text-gray-800 font-medium">
          {Number(value)}項目
        </div>
      ),
    },
    {
      key: 'inspection_date',
      label: '検査日',
      width: 120,
      sortable: true,
      editable: false,
      locked: false,
      sortType: 'date',
      render: (inspection: Inspection, value: unknown) => (
        <div className="text-sm text-gray-600">
          {value ? new Date(String(value)).toLocaleDateString('ja-JP') : '-'}
        </div>
      ),
    },
    {
      key: 'inspection_result',
      label: '検査結果',
      width: 120,
      sortable: true,
      editable: false,
      locked: false,
      sortType: 'string',
      render: (inspection: Inspection, value: unknown) => {
        const result = String(value);
        const getResultColor = (result: string) => {
          switch (result) {
            case '合格': return 'bg-green-100 text-green-800';
            case '要再検査': return 'bg-red-100 text-red-800';
            case '検査中': return 'bg-blue-100 text-blue-800';
            case '検査待ち': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
          }
        };
        return (
          <span className={`px-2 py-1 text-xs rounded-full ${getResultColor(result)}`}>
            {result}
          </span>
        );
      },
    },
    {
      key: 'approval_status',
      label: '承認状況',
      width: 120,
      sortable: true,
      editable: false,
      locked: false,
      sortType: 'string',
      render: (inspection: Inspection, value: unknown) => {
        const status = String(value);
        const getStatusColor = (status: string) => {
          switch (status) {
            case '承認済み': return 'bg-green-100 text-green-800';
            case '未承認': return 'bg-yellow-100 text-yellow-800';
            case '差し戻し': return 'bg-red-100 text-red-800';
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
      render: (inspection: Inspection, value: unknown) => (
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
      render: (inspection: Inspection) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem 
              className="text-red-600"
              onClick={() => callbacks?.onDelete?.(inspection)}
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