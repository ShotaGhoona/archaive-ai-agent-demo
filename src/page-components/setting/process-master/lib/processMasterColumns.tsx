import React from 'react';
import { Badge } from '@/shared/shadcnui';
import { DataTableColumn } from '@/shared/view/table-view';

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
      <span className="font-mono font-medium">
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
      <span>
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
      <Badge className={`${getCategoryColor(String(value))}`}>
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
        <span className="font-mono bg-gray-50 px-2 py-1 rounded border w-full">
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
      <span className="text-gray-600">
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
];