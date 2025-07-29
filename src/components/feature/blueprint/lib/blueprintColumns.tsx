import React from 'react';
import Link from 'next/link';
import { Badge, Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/shared/shadcnui';
import { Eye, Edit, Trash2, MoreHorizontal } from 'lucide-react';
import { DataTableColumn } from '@/shared/basic-data-table';

export interface Blueprint {
  filename: string;
  orderSource: string;
  productName: string;
  internalNumber: string;
  customerNumber: string;
  cadName: string;
  camName: string;
  orderQuantity: number;
  orderDate: string;
  deliveryDate: string;
  maxDimensionL: number;
  maxDimensionD: number;
  maxDimensionH: number;
  companyField: string;
  image: string;
}

export const BLUEPRINT_COLUMNS: DataTableColumn<Blueprint>[] = [
  {
    key: 'filename',
    label: 'ファイル名',
    width: 256,
    sortable: true,
    editable: true,
    locked: false,
    inputType: 'text',
    sortType: 'string',
    render: (blueprint: Blueprint, value: string) => (
      <Link
        href={`/blueprints/${blueprint.internalNumber}`}
        className="hover:underline font-mono text-sm font-medium text-primary"
        onClick={(e) => e.stopPropagation()}
      >
        {value}
      </Link>
    ),
  },
  {
    key: 'orderSource',
    label: '発注元',
    width: 192,
    sortable: true,
    editable: false,
    locked: true,
    sortType: 'string',
  },
  {
    key: 'productName',
    label: '製品名',
    width: 192,
    sortable: true,
    editable: false,
    locked: true,
    sortType: 'string',
  },
  {
    key: 'internalNumber',
    label: '社内整番',
    width: 128,
    sortable: true,
    editable: true,
    locked: false,
    inputType: 'text',
    sortType: 'string',
    render: (blueprint: Blueprint, value: string) => (
      <Badge variant="outline" className="font-mono text-xs">
        {value}
      </Badge>
    ),
  },
  {
    key: 'customerNumber',
    label: '客先整番',
    width: 128,
    sortable: true,
    editable: true,
    locked: false,
    inputType: 'text',
    sortType: 'string',
    render: (blueprint: Blueprint, value: string) => (
      <Badge variant="outline" className="font-mono text-xs">
        {value}
      </Badge>
    ),
  },
  {
    key: 'orderQuantity',
    label: '受注個数',
    width: 96,
    sortable: true,
    editable: true,
    locked: false,
    inputType: 'number',
    sortType: 'number',
  },
  {
    key: 'orderDate',
    label: '受注日',
    width: 112,
    sortable: true,
    editable: true,
    locked: false,
    inputType: 'date',
    sortType: 'date',
  },
  {
    key: 'deliveryDate',
    label: '納品日',
    width: 112,
    sortable: true,
    editable: true,
    locked: false,
    inputType: 'date',
    sortType: 'date',
  },
  {
    key: 'companyField',
    label: '全社項目',
    width: 128,
    sortable: true,
    editable: true,
    locked: false,
    inputType: 'text',
    sortType: 'string',
  },
  {
    key: 'actions',
    label: '操作',
    width: 80,
    minWidth: 80,
    sortable: false,
    editable: false,
    locked: false,
    render: (blueprint: Blueprint) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <Link href={`/blueprints/${blueprint.internalNumber}`}>
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