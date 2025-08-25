import React from 'react';
import { Badge } from '@/shared';
import { TableViewConfig } from '@/shared/view/table-view';

export interface EquipmentMaster {
  id: string;
  category: string;
  equipmentName: string;
  specification: string;
  manufacturer: string;
  hourlyRate: number;
  energyCost: number;
  maintenanceCost: number;
  notes: string;
  updatedAt: string;
}

const getCategoryColor = (category: string) => {
  switch (category) {
    case '加工機械': return 'bg-blue-100 text-blue-800';
    case '溶接機械': return 'bg-red-100 text-red-800';
    case '測定機器': return 'bg-green-100 text-green-800';
    case '搬送機械': return 'bg-yellow-100 text-yellow-800';
    case '熱処理': return 'bg-purple-100 text-purple-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const createEquipmentMasterTableConfig = (): TableViewConfig<EquipmentMaster> => ({
  columns: [
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
      key: 'category',
      label: '設備カテゴリ',
      width: 120,
      sortable: true,
      editable: true,
      locked: false,
      inputType: 'select',
      sortType: 'string',
      selectOptions: ['加工機械', '溶接機械', '測定機器', '搬送機械', '熱処理', 'その他'],
      render: (_, value: unknown) => (
        <Badge className={`${getCategoryColor(String(value))}`}>
          {String(value)}
        </Badge>
      ),
    },
    {
      key: 'equipmentName',
      label: '設備名',
      width: 140,
      sortable: true,
      editable: true,
      locked: false,
      inputType: 'text',
      sortType: 'string',
      render: (_, value: unknown) => (
        <span className="font-medium">
          {String(value)}
        </span>
      ),
    },
    {
      key: 'specification',
      label: '仕様・規格',
      width: 180,
      sortable: true,
      editable: true,
      locked: false,
      inputType: 'text',
      sortType: 'string',
      render: (_, value: unknown) => (
        <span className="text-sm text-gray-600">
          {String(value)}
        </span>
      ),
    },
    {
      key: 'manufacturer',
      label: 'メーカー',
      width: 120,
      sortable: true,
      editable: true,
      locked: false,
      inputType: 'text',
      sortType: 'string',
    },
    {
      key: 'hourlyRate',
      label: '時間単価(円)',
      width: 110,
      sortable: true,
      editable: true,
      locked: false,
      inputType: 'number',
      sortType: 'number',
      render: (_, value: unknown) => (
        <span className="font-mono font-medium text-green-600">
          ¥{Number(value).toLocaleString()}/h
        </span>
      ),
    },
    {
      key: 'energyCost',
      label: '電力費(円/h)',
      width: 100,
      sortable: true,
      editable: true,
      locked: false,
      inputType: 'number',
      sortType: 'number',
      render: (_, value: unknown) => (
        <span className="font-mono text-blue-600">
          ¥{Number(value).toLocaleString()}
        </span>
      ),
    },
    {
      key: 'maintenanceCost',
      label: '保守費(円/h)',
      width: 100,
      sortable: true,
      editable: true,
      locked: false,
      inputType: 'number',
      sortType: 'number',
      render: (_, value: unknown) => (
        <span className="font-mono text-orange-600">
          ¥{Number(value).toLocaleString()}
        </span>
      ),
    },
    {
      key: 'notes',
      label: '備考',
      width: 200,
      sortable: false,
      editable: true,
      locked: false,
      inputType: 'text',
      render: (_, value: unknown) => (
        <span className="text-sm text-gray-600">
          {String(value) || '-'}
        </span>
      ),
    },
    {
      key: 'updatedAt',
      label: '更新日',
      width: 100,
      sortable: true,
      editable: false,
      locked: true,
      sortType: 'date',
      render: (_, value: unknown) => (
        <span className="text-xs text-gray-500">
          {String(value)}
        </span>
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

