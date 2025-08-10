import React from 'react';
import Link from 'next/link';
import { Badge, Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/shared/shadcnui';
import { Edit, Trash2, MoreHorizontal, ZoomIn, ExternalLink } from 'lucide-react';
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

// プレビュー用のコールバック型
export interface BlueprintColumnCallbacks {
  onPreview?: (blueprint: Blueprint) => void;
}

export const createBlueprintColumns = (callbacks?: BlueprintColumnCallbacks): DataTableColumn<Blueprint>[] => [
  {
    key: 'detail',
    label: '詳細',
    width: 50,
    minWidth: 0,
    sortable: false,
    editable: false,
    locked: true,
    render: (blueprint: Blueprint) => (
      <Link href={`/project/${blueprint.internalNumber}/blueprint`}>
        <Button variant="outline" size="sm" className="h-8">
          <ExternalLink className="h-3 w-3" />
        </Button>
      </Link>
    ),
  },
  {
    key: 'filename',
    label: 'ファイル名',
    width: 256,
    sortable: true,
    editable: true,
    locked: false,
    inputType: 'text',
    sortType: 'string',
    render: (blueprint: Blueprint,value: unknown) => (
      <span className="font-mono text-sm font-medium">
        {String(value)}
      </span>
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
    render: (blueprint: Blueprint, value: unknown) => (
      <Badge variant="outline" className="font-mono text-xs">
        {String(value)}
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
    render: (blueprint: Blueprint, value: unknown) => (
      <Badge variant="outline" className="font-mono text-xs">
        {String(value)}
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
    key: 'maxDimensionL',
    label: '最大長',
    width: 64,
    sortable: true,
    editable: true,
    locked: false,
    inputType: 'number',
    sortType: 'number',
  },
  {
    key: 'maxDimensionD',
    label: '最大幅',
    width: 64,
    sortable: true,
    editable: true,
    locked: false,
    inputType: 'number',
    sortType: 'number',
  },
  {
    key: 'maxDimensionH',
    label: '最大高',
    width: 64,
    sortable: true,
    editable: true,
    locked: false,
    inputType: 'number',
    sortType: 'number',
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
          <DropdownMenuItem onClick={() => callbacks?.onPreview?.(blueprint)}>
            <ZoomIn className="h-4 w-4 mr-2" />
            プレビュー
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

// 後方互換性のため
export const BLUEPRINT_COLUMNS = createBlueprintColumns();