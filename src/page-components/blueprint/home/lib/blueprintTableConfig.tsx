import React from 'react';
import Link from 'next/link';
import { Button } from '@/shared';
import { ExternalLink } from 'lucide-react';
import { TableViewConfig } from '@/shared/view/table-view';

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


export const createBlueprintTableConfig = (): TableViewConfig<Blueprint> => ({
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
      render: (blueprint: Blueprint) => (
        <Link href={`/blueprint/${blueprint.internalNumber}/basic-information`}>
          <Button size="sm" variant="outline" className="h-8 text-primary font-bold hover:text-primary/80">
            <ExternalLink className="h-3 w-3" />
            開く
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
  ],
  pagination: {
    enabled: true,
    defaultItemsPerPage: 20,
    allowedItemsPerPage: [10, 20, 50, 100],
    showItemsPerPageSelector: true,
    maxVisiblePages: 7,
  },
});

