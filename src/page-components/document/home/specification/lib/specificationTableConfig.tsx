import React from 'react';
import Link from 'next/link';
import { ExternalLink, MoreHorizontal, Trash2 } from 'lucide-react';
import {
  Button,
  TableViewConfig,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  SelectOption,
} from '@/shared';
import { DocumentSpecificationDataInterface } from '@/dummy-data-er-fix/document';
import { SpecificationColumnCallbacks } from '../model';

export const createSpecificationTableConfig = (
  callbacks: SpecificationColumnCallbacks = {},
): TableViewConfig<DocumentSpecificationDataInterface> => ({
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
      render: (specification: DocumentSpecificationDataInterface) => (
        <Link
          href={`/document/specification/${specification.id}`}
        >
          <Button
            size='sm'
            variant='outline'
            className='text-primary hover:text-primary/80 h-8 font-bold'
          >
            <ExternalLink className='h-3 w-3' />
            開く
          </Button>
        </Link>
      ),
    },
    {
      key: 'leaf_product_document_custom_items.仕様書番号.value',
      label: '仕様書番号',
      width: 180,
      sortable: true,
      editable: true,
      locked: false,
      inputType: 'text',
      sortType: 'string',
    },
    {
      key: 'leaf_product_name',
      label: '製品名',
      width: 200,
      sortable: true,
      editable: true,
      locked: false,
      inputType: 'text',
      sortType: 'string',
    },
    {
      key: 'customer_name',
      label: '顧客名',
      width: 200,
      sortable: true,
      editable: true,
      locked: false,
      inputType: 'text',
      sortType: 'string',
    },
    {
      key: 'leaf_product_document_custom_items.承認日.value',
      label: '承認日',
      width: 120,
      sortable: true,
      editable: true,
      locked: false,
      sortType: 'date',
      inputType: 'date',
    },
    {
      key: 'leaf_product_document_custom_items.仕様分類.value',
      label: '仕様分類',
      width: 150,
      sortable: true,
      editable: true,
      locked: false,
      inputType: 'select',
      sortType: 'string',
      selectOptions: [
        { label: '機械仕様', color: 'blue' },
        { label: '電気仕様', color: 'green' },
        { label: 'ソフトウェア仕様', color: 'purple' },
        { label: '材料仕様', color: 'orange' },
        { label: '品質仕様', color: 'red' },
        { label: 'システム仕様', color: 'indigo' },
        { label: '環境仕様', color: 'emerald' },
        { label: '安全仕様', color: 'yellow' },
        { label: 'パフォーマンス仕様', color: 'sky' },
        { label: 'メンテナンス仕様', color: 'pink' },
      ],
    },
    {
      key: 'leaf_product_document_custom_items.適用規格.value',
      label: '適用規格',
      width: 150,
      sortable: true,
      editable: true,
      locked: false,
      inputType: 'text',
      sortType: 'string',
    },
    {
      key: 'name',
      label: 'ドキュメント名',
      width: 220,
      sortable: true,
      editable: true,
      locked: false,
      inputType: 'text',
      sortType: 'string',
    },
    {
      key: 'version',
      label: 'バージョン',
      width: 100,
      sortable: true,
      editable: true,
      locked: false,
      inputType: 'number',
      sortType: 'number',
    },
    {
      key: 'created_by_name',
      label: '作成者',
      width: 120,
      sortable: true,
      editable: true,
      locked: false,
      inputType: 'user',
      sortType: 'string',
    },
    {
      key: 'remarks',
      label: '備考',
      width: 200,
      sortable: false,
      editable: true,
      locked: false,
      inputType: 'text',
    },
    {
      key: 'created_at',
      label: '作成日時',
      width: 150,
      sortable: true,
      editable: true,
      locked: true,
      sortType: 'date',
    },
    {
      key: 'updated_at',
      label: '最終更新日時',
      width: 150,
      sortable: true,
      editable: true,
      locked: true,
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
      render: (specification: DocumentSpecificationDataInterface) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' size='sm'>
              <MoreHorizontal className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuItem
              className='text-red-600'
              onClick={() => callbacks?.onDelete?.(specification)}
            >
              <Trash2 className='mr-2 h-4 w-4' />
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
