import React from 'react';
import Link from 'next/link';
import { Badge, Button } from '@/shared';
import { ExternalLink } from 'lucide-react';
import { TableViewConfig } from '@/shared/view/table-view';

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


export const createProjectTableConfig = (): TableViewConfig<Project> => ({
  columns: [
    {
      key: 'detail',
      label: '詳細',
      width: 50,
      minWidth: 0,
      sortable: false,
      editable: false,
      locked: true,
      stickyLeft: 0,
      render: (project: Project) => (
        <Link href={`/project/${project.projectId}/basic-information`}>
          <Button size="sm" variant="outline" className="h-8 text-primary font-bold hover:text-primary/80">
            <ExternalLink className="h-3 w-3" />
            開く
          </Button>
        </Link>
      ),
    },
    {
      key: 'projectId',
      label: '案件ID',
      width: 140,
      sortable: true,
      editable: false,
      locked: true,
      sortType: 'string',
      render: (project: Project, value: unknown) => (
        <span className="font-mono text-sm font-medium">
          {String(value)}
        </span>
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
      selectOptions: [
        { label: '問い合わせ', color: 'blue' },
        { label: '見積もり中', color: 'yellow' },
        { label: '納品', color: 'green' }
      ],
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
      selectOptions: [
        { label: '未提出', color: 'red' },
        { label: '作成中', color: 'yellow' },
        { label: '提出済', color: 'green' }
      ],
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
      selectOptions: [
        { label: '未対応', color: 'gray' },
        { label: '配送準備中', color: 'blue' },
        { label: '配送中', color: 'yellow' },
        { label: '配送完了', color: 'green' }
      ],
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

