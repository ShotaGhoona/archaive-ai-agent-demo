import React from 'react';
import Link from 'next/link';
import { ExternalLink, MoreHorizontal, Trash2 } from 'lucide-react';
import { Button, TableViewConfig, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, SelectOption } from '@/shared';
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
    },
    {
      key: 'project_name',
      label: 'プロジェクト名',
      width: 180,
      sortable: true,
      editable: false,
      locked: false,
      sortType: 'string',
    },
    {
      key: 'inspection_items_count',
      label: '検査項目数',
      width: 120,
      sortable: true,
      editable: false,
      locked: false,
      sortType: 'number',
      inputType: 'number',
    },
    {
      key: 'inspection_date',
      label: '検査日',
      width: 120,
      sortable: true,
      editable: false,
      locked: false,
      sortType: 'date',
      inputType: 'date',
    },
    {
      key: 'inspection_result',
      label: '検査結果',
      width: 120,
      sortable: true,
      editable: false,
      locked: false,
      sortType: 'string',
      inputType: 'select',
      selectOptions: [
        { label: '合格', color: 'green' },
        { label: '要再検査', color: 'red' },
        { label: '検査中', color: 'blue' },
        { label: '検査待ち', color: 'yellow' }
      ] as SelectOption[],
    },
    {
      key: 'approval_status',
      label: '承認状況',
      width: 120,
      sortable: true,
      editable: false,
      locked: false,
      sortType: 'string',
      inputType: 'select',
      selectOptions: [
        { label: '承認済み', color: 'green' },
        { label: '未承認', color: 'yellow' },
        { label: '差し戻し', color: 'red' }
      ] as SelectOption[],
    },
    {
      key: 'updated_at',
      label: '最終更新日',
      width: 130,
      sortable: true,
      editable: false,
      locked: false,
      sortType: 'date',
    },
    {
      key: 'actions',
      label: '操作',
      width: 80,
      minWidth: 80,
      sortable: false,
      editable: false,
      locked: false,
      stickyRight: 0,
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