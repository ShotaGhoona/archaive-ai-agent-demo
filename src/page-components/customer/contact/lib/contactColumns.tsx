
import React from 'react';
import Link from 'next/link';
import { Badge, Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/shared/shadcnui';
import { Phone, User, Mail, MoreHorizontal, Eye, Edit, Trash2 } from 'lucide-react';
import { DataTableColumn } from '@/shared/view/table-view';

export interface Contact {
  contactId: string;
  customerId: string;
  contactName: string;
  department: string;
  position: string;
  contactType: 'primary' | 'secondary' | 'emergency';
  phoneNumber: string;
  mobileNumber?: string;
  email: string;
  notes?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const getContactTypeVariant = (type: Contact['contactType']) => {
  switch (type) {
    case 'primary': return 'default' as const;
    case 'secondary': return 'outline' as const;
    case 'emergency': return 'destructive' as const;
    default: return 'secondary' as const;
  }
};

export const getContactTypeLabel = (type: Contact['contactType']) => {
  switch (type) {
    case 'primary': return '主要';
    case 'secondary': return '副次';
    case 'emergency': return '緊急';
    default: return type;
  }
};

export interface ContactColumnCallbacks {
  onEdit?: (contact: Contact) => void;
  onDelete?: (contact: Contact) => void;
}

export const createContactColumns = (callbacks: ContactColumnCallbacks): DataTableColumn<Contact>[] => [
  {
    key: 'contactName',
    label: '連絡先名',
    width: 120,
    sortable: true,
    editable: true,
    locked: false,
    sortType: 'string',
    render: (contact) => (
      <div className="flex items-center">
        <User className="w-4 h-4 mr-2"/>
        <span>{contact.contactName}</span>
      </div>
    )
  },
  {
    key: 'department',
    label: '部門',
    width: 100,
    sortable: true,
    editable: true,
    locked: false,
    inputType: 'select',
    selectOptions: ['営業部', '技術部', '製造部', '品質管理部', '経理部', '総務部', '企画部', 'その他'],
    sortType: 'string',
    render: (contact) => (
      <Badge variant="outline">{contact.department}</Badge>
    )
  },
  {
    key: 'position',
    label: '役職',
    width: 80,
    sortable: true,
    editable: true,
    locked: false,
    inputType: 'select',
    selectOptions: ['取締役', '部長', '課長', '係長', '主任', '担当者', 'その他'],
    sortType: 'string'
  },
  {
    key: 'contactType',
    label: 'タイプ',
    width: 80,
    sortable: true,
    editable: true,
    locked: false,
    inputType: 'select',
    selectOptions: ['primary', 'secondary', 'emergency'],
    sortType: 'string',
    render: (contact) => (
      <Badge variant={getContactTypeVariant(contact.contactType)}>
        {getContactTypeLabel(contact.contactType)}
      </Badge>
    )
  },
  {
    key: 'phoneNumber',
    label: '電話番号',
    width: 130,
    sortable: false,
    editable: true,
    locked: false,
    inputType: 'text',
    render: (contact) => (
      <div className="flex items-center">
        <Phone className="w-4 h-4 mr-2" />
        <span>{contact.phoneNumber}</span>
      </div>
    )
  },
  {
    key: 'email',
    label: 'メール',
    width: 200,
    sortable: true,
    editable: true,
    locked: false,
    inputType: 'email',
    sortType: 'string',
    render: (contact) => (
      <div className="flex items-center">
        <Mail className="w-4 h-4 mr-2" />
        <span>{contact.email}</span>
      </div>
    )
  },
  {
    key: 'isActive',
    label: 'ステータス',
    width: 80,
    sortable: true,
    editable: true,
    locked: false,
    inputType: 'select',
    selectOptions: ['true', 'false'],
    sortType: 'string',
    render: (contact) => (
      <Badge variant={contact.isActive ? 'default' : 'secondary'}>
        {contact.isActive ? 'アクティブ' : '非アクティブ'}
      </Badge>
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
          <Link href={`/customers/${contact.customerId}`}>
            <DropdownMenuItem>
              <Eye className="h-4 w-4 mr-2" />
              詳細表示
            </DropdownMenuItem>
          </Link>
          <DropdownMenuItem onClick={() => callbacks?.onEdit?.(contact)}>
            <Edit className="h-4 w-4 mr-2" />
            編集
          </DropdownMenuItem>
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
];

export const CONTACT_COLUMNS = createContactColumns({});