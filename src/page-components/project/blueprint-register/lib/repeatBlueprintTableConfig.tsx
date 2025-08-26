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
      key: 'filename',
      label: 'ファイル名',
      sortable: true,
      render: (blueprint) => (
        <div className="font-medium text-gray-900 truncate max-w-48" title={blueprint.filename}>
          {blueprint.filename}
        </div>
      )
    },
    {
      key: 'productName',
      label: '製品名',
      sortable: true,
      render: (blueprint) => (
        <div className="truncate max-w-40" title={blueprint.productName}>
          {blueprint.productName}
        </div>
      )
    },
    {
      key: 'orderSource',
      label: '発注元',
      sortable: true,
      render: (blueprint) => (
        <div className="text-sm text-gray-600 truncate max-w-32" title={blueprint.orderSource}>
          {blueprint.orderSource}
        </div>
      )
    },
    {
      key: 'customerNumber',
      label: '顧客整番',
      sortable: true,
      render: (blueprint) => (
        <div className="font-mono text-xs text-gray-700">
          {blueprint.customerNumber}
        </div>
      )
    },
    {
      key: 'orderQuantity',
      label: '数量',
      sortable: true,
      render: (blueprint) => (
        <div className="text-sm text-gray-700 text-right">
          {blueprint.orderQuantity}個
        </div>
      )
    },
    {
      key: 'companyField',
      label: '業界',
      sortable: true,
      render: (blueprint) => (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          {blueprint.companyField}
        </span>
      )
    },
    {
      key: 'deliveryDate',
      label: '納期',
      sortable: true,
      render: (blueprint) => (
        <div className="text-sm text-gray-600">
          {blueprint.deliveryDate}
        </div>
      )
    },
    {
      key: 'actions',
      label: 'リピート品登録',
      sortable: false,
      render: (blueprint) => (
        <Button
          size="sm"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onRepeatRegister(blueprint);
          }}
          className="bg-primary hover:bg-primary/90"
        >
          <Plus className="h-3 w-3 mr-1" />
          登録
        </Button>
      )
    }
  ],
  
  pagination: {
    enabled: true,
    defaultItemsPerPage: 10,
    allowedItemsPerPage: [5, 10, 20, 50],
    showItemsPerPageSelector: true,
    maxVisiblePages: 5,
  },
  
  sorting: {
    enabled: true,
    defaultSort: { key: 'orderDate', direction: 'desc' }
  },
  
  selection: {
    enabled: false
  },
  
  getRowId: (blueprint) => blueprint.internalNumber,
  
  onRowClick: (blueprint) => {
    window.open(`/blueprint/${blueprint.internalNumber}/basic-information`, '_blank');
  }
});