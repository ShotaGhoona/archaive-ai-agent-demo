import React from 'react';
import Link from 'next/link';
import { Badge, Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/shared/shadcnui';
import { Eye, Edit, Trash2, MoreHorizontal } from 'lucide-react';
import { DataTableColumn } from '@/shared/basic-data-table';

export interface Project {
  projectId: string;
  customerName: string;
  assignee: string;
  responseDeadline: string;
  workCompleteDate: string;
  deliveryDeadline: string;
  receiptDate: string;
  projectStatus: string;
  quotationStatus: string;
  deliveryStatus: string;
  lastUpdatedBy: string;
  lastUpdatedAt: string;
}

const getStatusColor = (status: string, type: 'project' | 'quotation' | 'delivery') => {
  if (type === 'project') {
    switch (status) {
      case '問い合わせ': return 'bg-blue-100 text-blue-800';
      case '見積もり中': return 'bg-yellow-100 text-yellow-800';
      case '納品': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }
  if (type === 'quotation') {
    switch (status) {
      case '未提出': return 'bg-red-100 text-red-800';
      case '作成中': return 'bg-yellow-100 text-yellow-800';
      case '提出済': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }
  if (type === 'delivery') {
    switch (status) {
      case '未対応': return 'bg-gray-100 text-gray-800';
      case '配送準備中': return 'bg-blue-100 text-blue-800';
      case '配送中': return 'bg-yellow-100 text-yellow-800';
      case '配送完了': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }
  return 'bg-gray-100 text-gray-800';
};

export const PROJECT_COLUMNS: DataTableColumn<Project>[] = [
  {
    key: 'projectId',
    label: '案件ID',
    width: 140,
    sortable: true,
    editable: false,
    locked: true,
    sortType: 'string',
    render: (project: Project, value: unknown) => (
      <Link
        href={`/project/${project.projectId}`}
        className="hover:underline font-mono text-sm font-medium text-primary"
        onClick={(e) => e.stopPropagation()}
      >
        {String(value)}
      </Link>
    ),
  },
  {
    key: 'customerName',
    label: '顧客名',
    width: 200,
    sortable: true,
    editable: true,
    locked: false,
    inputType: 'text',
    sortType: 'string',
  },
  {
    key: 'assignee',
    label: '担当者',
    width: 120,
    sortable: true,
    editable: true,
    locked: false,
    inputType: 'text',
    sortType: 'string',
  },
  {
    key: 'responseDeadline',
    label: '回答期日',
    width: 120,
    sortable: true,
    editable: true,
    locked: false,
    inputType: 'date',
    sortType: 'date',
  },
  {
    key: 'workCompleteDate',
    label: '作業完了日',
    width: 120,
    sortable: true,
    editable: true,
    locked: false,
    inputType: 'date',
    sortType: 'date',
    render: (project: Project, value: unknown) => (
      <span className={value ? '' : 'text-gray-400'}>
        {String(value) || '未完了'}
      </span>
    ),
  },
  {
    key: 'deliveryDeadline',
    label: '納品期日',
    width: 120,
    sortable: true,
    editable: true,
    locked: false,
    inputType: 'date',
    sortType: 'date',
  },
  {
    key: 'receiptDate',
    label: '入荷期日',
    width: 120,
    sortable: true,
    editable: true,
    locked: false,
    inputType: 'date',
    sortType: 'date',
    render: (project: Project, value: unknown) => (
      <span className={value ? '' : 'text-gray-400'}>
        {String(value) || '未入荷'}
      </span>
    ),
  },
  {
    key: 'projectStatus',
    label: '案件状況',
    width: 120,
    sortable: true,
    editable: true,
    locked: false,
    inputType: 'select',
    sortType: 'string',
    selectOptions: ['問い合わせ', '見積もり中', '納品'],
    render: (project: Project, value: unknown) => (
      <Badge className={`text-xs ${getStatusColor(String(value), 'project')}`}>
        {String(value)} 
      </Badge>
    ),
  },
  {
    key: 'quotationStatus',
    label: '見積書ステータス',
    width: 140,
    sortable: true,
    editable: true,
    locked: false,
    inputType: 'select',
    sortType: 'string',
    selectOptions: ['未提出', '作成中', '提出済'],
    render: (project: Project, value: unknown) => (
      <Badge className={`text-xs ${getStatusColor(String(value), 'quotation')}`}>
        {String(value)}
      </Badge>
    ),
  },
  {
    key: 'deliveryStatus',
    label: '納品書ステータス',
    width: 140,
    sortable: true,
    editable: true,
    locked: false,
    inputType: 'select',
    sortType: 'string',
    selectOptions: ['未対応', '配送準備中', '配送中', '配送完了'],
    render: (project: Project, value: unknown) => (
      <Badge className={`text-xs ${getStatusColor(String(value), 'delivery')}`}>
        {String(value)}
      </Badge>
    ),
  },
  {
    key: 'lastUpdatedBy',
    label: '最終更新者',
    width: 120,
    sortable: true,
    editable: false,
    locked: true,
    sortType: 'string',
  },
  {
    key: 'lastUpdatedAt',
    label: '最終更新日時',
    width: 160,
    sortable: true,
    editable: false,
    locked: true,
    sortType: 'date',
    render: (project: Project, value: unknown) => (
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
    render: (project: Project) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <Link href={`/projects/${project.projectId}`}>
            <DropdownMenuItem>
              <Eye className="h-4 w-4 mr-2" />
              詳細表示
            </DropdownMenuItem>
          </Link>
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