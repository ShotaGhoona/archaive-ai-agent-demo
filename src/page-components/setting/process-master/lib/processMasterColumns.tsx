import React from 'react';
import { Badge, Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/shared/shadcnui';
import { Eye, Edit, Trash2, MoreHorizontal, Calculator } from 'lucide-react';
import { DataTableColumn } from '@/shared/basic-data-table';

export interface ProcessMaster {
  id: string;
  processName: string;
  processCategory: string;
  customFormula: string;
  remarks: string;
  updatedAt: string;
}

const getCategoryColor = (category: string) => {
  switch (category) {
    case '加工': return 'bg-blue-100 text-blue-800';
    case '組立': return 'bg-green-100 text-green-800';
    case '検査': return 'bg-yellow-100 text-yellow-800';
    case '塗装': return 'bg-purple-100 text-purple-800';
    case '溶接': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const PROCESS_MASTER_COLUMNS: DataTableColumn<ProcessMaster>[] = [
  {
    key: 'id',
    label: 'ID',
    width: 80,
    sortable: true,
    editable: false,
    locked: true,
    sortType: 'string',
    render: (_, value: unknown) => (
      <span className="font-mono text-sm font-medium">
        {String(value)}
      </span>
    ),
  },
  {
    key: 'processName',
    label: '工程名',
    width: 200,
    sortable: true,
    editable: true,
    locked: false,
    inputType: 'text',
    sortType: 'string',
    render: (_, value: unknown) => (
      <span className="font-medium">
        {String(value)}
      </span>
    ),
  },
  {
    key: 'processCategory',
    label: '工程分類',
    width: 120,
    sortable: true,
    editable: true,
    locked: false,
    inputType: 'select',
    sortType: 'string',
    selectOptions: ['加工', '組立', '検査', '塗装', '溶接', 'その他'],
    render: (_, value: unknown) => (
      <Badge className={`text-xs ${getCategoryColor(String(value))}`}>
        {String(value)}
      </Badge>
    ),
  },
  {
    key: 'customFormula',
    label: 'カスタム式',
    width: 300,
    sortable: false,
    editable: true,
    locked: false,
    inputType: 'text',
    sortType: 'string',
    render: (_, value: unknown) => (
      <div className="flex items-center space-x-2">
        <Calculator className="h-4 w-4 text-gray-500" />
        <span className="font-mono text-sm bg-gray-50 px-2 py-1 rounded border">
          {String(value) || '未設定'}
        </span>
      </div>
    ),
  },
  {
    key: 'remarks',
    label: '備考',
    width: 200,
    sortable: false,
    editable: true,
    locked: false,
    inputType: 'text',
    sortType: 'string',
    render: (_, value: unknown) => (
      <span className="text-sm text-gray-600 truncate">
        {String(value) || '-'}
      </span>
    ),
  },
  {
    key: 'updatedAt',
    label: '更新日時',
    width: 160,
    sortable: true,
    editable: false,
    locked: true,
    sortType: 'date',
    render: (_, value: unknown) => (
      <span className="text-xs text-gray-600">
        {new Date(String(value)).toLocaleString('ja-JP', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        })}
      </span>
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
    render: () => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <Eye className="h-4 w-4 mr-2" />
            詳細表示
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Edit className="h-4 w-4 mr-2" />
            編集
          </DropdownMenuItem>
          <DropdownMenuItem className="text-red-600">
            <Trash2 className="h-4 w-4 mr-2" />
            削除
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];