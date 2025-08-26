import React from 'react';
import { Button } from '@/shared';
import { Plus } from 'lucide-react';
import { TableViewConfig } from '@/shared/view/table-view';
import { RepeatBlueprint } from './repeatBlueprintGalleryConfig';

interface CreateRepeatBlueprintTableConfigOptions {
  onRepeatRegister: (blueprint: RepeatBlueprint) => void;
}

export const createRepeatBlueprintTableConfig = ({
  onRepeatRegister
}: CreateRepeatBlueprintTableConfigOptions): TableViewConfig<RepeatBlueprint> => ({
  columns: [
    {
      key: 'actions',
      label: 'リピート品',
      width: 120,
      minWidth: 120,
      sortable: false,
      editable: false,
      locked: true,
      stickyLeft: 0,
      render: (blueprint: RepeatBlueprint) => (
        <Button
          size="sm"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onRepeatRegister(blueprint);
          }}
          className="bg-primary hover:bg-primary/90 h-8"
        >
          <Plus className="h-3 w-3 mr-1" />
          登録
        </Button>
      )
    },
    {
      key: 'filename',
      label: 'ファイル名',
      width: 200,
      sortable: true,
      editable: true,
      locked: false,
      sortType: 'string',
      render: (blueprint: RepeatBlueprint, value: unknown) => (
        <span className="font-mono text-sm font-medium" title={String(value)}>
          {String(value)}
        </span>
      )
    },
    {
      key: 'productName',
      label: '製品名',
      width: 180,
      sortable: true,
      editable: false,
      locked: false,
      sortType: 'string',
      render: (blueprint: RepeatBlueprint, value: unknown) => (
        <span className="text-sm" title={String(value)}>
          {String(value)}
        </span>
      )
    },
    {
      key: 'orderSource',
      label: '発注元',
      width: 160,
      sortable: true,
      editable: false,
      locked: false,
      sortType: 'string',
      render: (blueprint: RepeatBlueprint, value: unknown) => (
        <span className="text-sm text-gray-600" title={String(value)}>
          {String(value)}
        </span>
      )
    },
    {
      key: 'customerNumber',
      label: '顧客整番',
      width: 120,
      sortable: true,
      editable: false,
      locked: false,
      sortType: 'string',
      render: (blueprint: RepeatBlueprint, value: unknown) => (
        <span className="font-mono text-xs text-gray-700">
          {String(value)}
        </span>
      )
    },
    {
      key: 'orderQuantity',
      label: '数量',
      width: 80,
      sortable: true,
      editable: false,
      locked: false,
      sortType: 'number',
      render: (blueprint: RepeatBlueprint, value: unknown) => (
        <div className="text-sm text-gray-700 text-right">
          {String(value)}個
        </div>
      )
    },
    {
      key: 'companyField',
      label: '業界',
      width: 100,
      sortable: true,
      editable: false,
      locked: false,
      sortType: 'string',
      render: (blueprint: RepeatBlueprint, value: unknown) => (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          {String(value)}
        </span>
      )
    },
    {
      key: 'deliveryDate',
      label: '納期',
      width: 100,
      sortable: true,
      editable: false,
      locked: false,
      sortType: 'date',
      render: (blueprint: RepeatBlueprint, value: unknown) => (
        <div className="text-sm text-gray-600">
          {String(value)}
        </div>
      )
    }
  ],
  
  pagination: {
    enabled: true,
    defaultItemsPerPage: 20,
    allowedItemsPerPage: [5, 10, 20, 50],
    showItemsPerPageSelector: true,
    maxVisiblePages: 5,
  },
});