import React from 'react';
import Link from 'next/link';
import { Button } from '@/shared';
import { ExternalLink } from 'lucide-react';
import { TableViewConfig } from '@/shared/view/table-view';

import { DirectoryBaseDataInterface } from '@/dummy-data-er-fix/project';

export const createProjectTableConfig =
  (): TableViewConfig<DirectoryBaseDataInterface> => ({
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
        render: (project: DirectoryBaseDataInterface) => (
          <Link href={`/project/${project.id}/basic-information`}>
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
        key: 'id',
        label: '案件ID',
        width: 140,
        sortable: true,
        editable: false,
        locked: true,
        sortType: 'string',
        render: (project: DirectoryBaseDataInterface, value: unknown) => (
          <span className='font-mono text-sm font-medium'>{String(value)}</span>
        ),
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
        key: 'directory_custom_items.担当者.value',
        label: '担当者',
        width: 120,
        sortable: true,
        editable: true,
        locked: false,
        inputType: 'text',
        sortType: 'string',
      },
      {
        key: 'directory_custom_items.回答期限.value',
        label: '回答期日',
        width: 120,
        sortable: true,
        editable: true,
        locked: false,
        inputType: 'date',
        sortType: 'date',
      },
      {
        key: 'directory_custom_items.作業完了日.value',
        label: '作業完了日',
        width: 120,
        sortable: true,
        editable: true,
        locked: false,
        inputType: 'date',
        sortType: 'date',
      },
      {
        key: 'directory_custom_items.納品期限.value',
        label: '納品期日',
        width: 120,
        sortable: true,
        editable: true,
        locked: false,
        inputType: 'date',
        sortType: 'date',
      },
      {
        key: 'directory_custom_items.受注日.value',
        label: '受注日',
        width: 120,
        sortable: true,
        editable: true,
        locked: false,
        inputType: 'date',
        sortType: 'date',
      },
      {
        key: 'directory_custom_items.案件ステータス.value',
        label: '案件状況',
        width: 120,
        sortable: true,
        editable: true,
        locked: false,
        inputType: 'select',
        sortType: 'string',
        selectOptions: [
          { label: '問い合わせ', color: 'purple' },
          { label: '見積もり中', color: 'yellow' },
          { label: '受注確定', color: 'indigo' },
          { label: '製作中', color: 'blue' },
          { label: '納品完了', color: 'green' },
        ],
      },
      {
        key: 'directory_custom_items.見積書ステータス.value',
        label: '見積書ステータス',
        width: 140,
        sortable: true,
        editable: true,
        locked: false,
        inputType: 'select',
        sortType: 'string',
        selectOptions: [
          { label: '未提出', color: 'red' },
          { label: '作成中', color: 'orange' },
          { label: '提出済', color: 'blue' },
        ],
      },
      {
        key: 'directory_custom_items.納品書ステータス.value',
        label: '納品書ステータス',
        width: 140,
        sortable: true,
        editable: true,
        locked: false,
        inputType: 'select',
        sortType: 'string',
        selectOptions: [
          { label: '未対応', color: 'gray' },
          { label: '配送準備中', color: 'yellow' },
          { label: '配送中', color: 'orange' },
          { label: '配送完了', color: 'green' },
        ],
      },
      {
        key: 'updated_by_name',
        label: '最終更新者',
        width: 120,
        sortable: true,
        editable: false,
        locked: true,
        sortType: 'string',
      },
      {
        key: 'updated_at',
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
