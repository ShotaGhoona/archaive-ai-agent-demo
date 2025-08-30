import React from 'react';
import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/shared';
import { MoreHorizontal, Trash2 } from 'lucide-react';
import { TableViewConfig } from '@/shared/view/table-view';
import { CustomerContactDataInterface } from '@/dummy-data/customer';


export interface ContactColumnCallbacks {
  onDelete?: (contact: CustomerContactDataInterface) => void;
}


export const createContactTableConfig = (callbacks: ContactColumnCallbacks = {}): TableViewConfig<CustomerContactDataInterface> => ({
  columns: [
    {
      key: 'contact_id',
      label: '連絡先ID',
      width: 120,
      sortable: true,
      editable: false,
      locked: true,
      inputType: 'text',
      sortType: 'string',
    },
    {
      key: 'last_name',
      label: '姓',
      width: 100,
      sortable: true,
      editable: true,
      locked: false,
      inputType: 'text',
      sortType: 'string',
    },
    {
      key: 'first_name',
      label: '名',
      width: 100,
      sortable: true,
      editable: true,
      locked: false,
      inputType: 'text',
      sortType: 'string',
    },
    {
      key: 'last_name_kana',
      label: '姓（カナ）',
      width: 120,
      sortable: true,
      editable: true,
      locked: false,
      inputType: 'text',
      sortType: 'string',
    },
    {
      key: 'first_name_kana',
      label: '名（カナ）',
      width: 120,
      sortable: true,
      editable: true,
      locked: false,
      inputType: 'text',
      sortType: 'string',
    },
    {
      key: 'title',
      label: '役職',
      width: 120,
      sortable: true,
      editable: true,
      locked: false,
      inputType: 'text',
      sortType: 'string',
    },
    {
      key: 'department',
      label: '部署名',
      width: 120,
      sortable: true,
      editable: true,
      locked: false,
      inputType: 'text',
      sortType: 'string',
    },
    {
      key: 'email_primary',
      label: '主要メールアドレス',
      width: 220,
      sortable: true,
      editable: true,
      locked: false,
      inputType: 'text',
      sortType: 'string',
    },
    {
      key: 'email_secondary',
      label: '副メールアドレス',
      width: 220,
      sortable: true,
      editable: true,
      locked: false,
      inputType: 'text',
      sortType: 'string',
    },
    {
      key: 'phone_office',
      label: '会社電話番号',
      width: 140,
      sortable: false,
      editable: true,
      locked: false,
      inputType: 'text',
    },
    {
      key: 'phone_mobile',
      label: '携帯電話番号',
      width: 140,
      sortable: false,
      editable: true,
      locked: false,
      inputType: 'text',
    },
    {
      key: 'fax',
      label: 'FAX番号',
      width: 120,
      sortable: false,
      editable: true,
      locked: false,
      inputType: 'text',
    },
    {
      key: 'status',
      label: 'ステータス',
      width: 100,
      sortable: true,
      editable: true,
      locked: false,
      inputType: 'select',
      sortType: 'string',
      selectOptions: [
        { label: '有効', color: 'green' },
        { label: '無効', color: 'gray' },
      ],
      render: (contact: CustomerContactDataInterface) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          contact.status 
            ? 'bg-green-100 text-green-800' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          {contact.status ? '有効' : '無効'}
        </span>
      ),
    },
    {
      key: 'description',
      label: '連絡先概要',
      width: 200,
      sortable: false,
      editable: true,
      locked: false,
      inputType: 'text',
    },
    {
      key: 'owner_user_id',
      label: '担当営業',
      width: 120,
      sortable: true,
      editable: true,
      locked: false,
      inputType: 'user',
      sortType: 'string',
    },
    {
      key: 'created_date',
      label: '作成日時',
      width: 160,
      sortable: true,
      editable: false,
      locked: true,
      sortType: 'date',
    },
    {
      key: 'modified_date',
      label: '最終更新日時',
      width: 160,
      sortable: true,
      editable: false,
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
      render: (contact: CustomerContactDataInterface) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem 
              className="text-red-600"
              onClick={() => callbacks?.onDelete?.(contact)}
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

