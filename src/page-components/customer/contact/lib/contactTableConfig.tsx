import React from 'react';
import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/shared';
import { Phone, User, Mail, MoreHorizontal, Trash2 } from 'lucide-react';
import { TableViewConfig } from '@/shared/view/table-view';

export interface Contact {
  id: number;
  customer_id: number;
  name: string;
  phone_number: string;
  email: string;
  created_at: string;
  updated_at: string;
}


export interface ContactColumnCallbacks {
  onDelete?: (contact: Contact) => void;
}


export const createContactTableConfig = (callbacks: ContactColumnCallbacks = {}): TableViewConfig<Contact> => ({
  columns: [
    {
      key: 'name',
      label: '担当者名',
      width: 150,
      sortable: true,
      editable: true,
      locked: false,
      inputType: 'text',
      sortType: 'string',
      render: (contact, value: unknown) => (
        <div className="flex items-center">
          <User className="w-4 h-4 mr-2"/>
          <span className="font-medium">{String(value)}</span>
        </div>
      )
    },
    {
      key: 'phone_number',
      label: '電話番号',
      width: 140,
      sortable: false,
      editable: true,
      locked: false,
      inputType: 'text',
      render: (contact, value: unknown) => (
        <div className="flex items-center">
          <Phone className="w-4 h-4 mr-2" />
          <span className="font-mono text-sm">{String(value)}</span>
        </div>
      )
    },
    {
      key: 'email',
      label: 'メールアドレス',
      width: 250,
      sortable: true,
      editable: true,
      locked: false,
      inputType: 'email',
      sortType: 'string',
      render: (contact, value: unknown) => (
        <div className="flex items-center">
          <Mail className="w-4 h-4 mr-2" />
          <span className="text-sm">{String(value)}</span>
        </div>
      )
    },
    {
      key: 'updated_at',
      label: '最終更新日',
      width: 130,
      sortable: true,
      editable: false,
      locked: false,
      sortType: 'date',
      render: (contact, value: unknown) => (
        <div className="text-sm text-gray-600">
          {value ? new Date(String(value)).toLocaleDateString('ja-JP') : '-'}
        </div>
      )
    },
    {
      key: 'actions',
      label: '操作',
      width: 80,
      minWidth: 80,
      sortable: false,
      editable: false,
      locked: false,
      render: (contact: Contact) => (
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

