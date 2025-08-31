import React from 'react';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared';
import { MoreHorizontal, Trash2 } from 'lucide-react';
import { TableViewConfig } from '@/shared/view/table-view';
import { CustomerContactDataInterface } from '@/dummy-data-er-fix/customer';
import { ContactColumnCallbacks } from '../model';


export const createContactTableConfig = (
  callbacks: ContactColumnCallbacks = {},
): TableViewConfig<CustomerContactDataInterface> => ({
  columns: [
    {
      key: 'id',
      label: '連絡先ID',
      width: 120,
      sortable: true,
      editable: false,
      locked: true,
      inputType: 'number',
      sortType: 'number',
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
      key: 'customer_contact_custom_items.役職.value',
      label: '役職',
      width: 120,
      sortable: true,
      editable: true,
      locked: false,
      inputType: 'select',
      sortType: 'string',
      selectOptions: [
        { label: '部長', color: 'purple' },
        { label: '課長', color: 'orange' },
        { label: '主任', color: 'emerald' },
        { label: '係長', color: 'yellow' },
        { label: 'チーフ', color: 'sky' },
        { label: '技師長', color: 'indigo' },
        { label: '取締役', color: 'purple' },
        { label: '工場長', color: 'orange' },
        { label: '営業部長', color: 'purple' },
      ],
    },
    {
      key: 'customer_contact_custom_items.部署.value',
      label: '部署名',
      width: 120,
      sortable: true,
      editable: true,
      locked: false,
      inputType: 'select',
      sortType: 'string',
      selectOptions: [
        { label: '営業部', color: 'blue' },
        { label: '技術部', color: 'green' },
        { label: '開発部', color: 'indigo' },
        { label: '品質管理部', color: 'red' },
        { label: '購買部', color: 'pink' },
        { label: '設計部', color: 'slate' },
        { label: '製造部', color: 'gray' },
      ],
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
      key: 'office_phone_number',
      label: '会社電話番号',
      width: 140,
      sortable: false,
      editable: true,
      locked: false,
      inputType: 'text',
    },
    {
      key: 'phone_number',
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
      key: 'is_active',
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
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
            contact.is_active
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {contact.is_active ? '有効' : '無効'}
        </span>
      ),
    },
    {
      key: 'customer_contact_custom_items.営業メモ.value',
      label: '営業メモ',
      width: 200,
      sortable: false,
      editable: true,
      locked: false,
      inputType: 'text',
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
      width: 160,
      sortable: true,
      editable: false,
      locked: true,
      sortType: 'date',
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
            <Button variant='ghost' size='sm'>
              <MoreHorizontal className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuItem
              className='text-red-600'
              onClick={() => callbacks?.onDelete?.(contact)}
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
