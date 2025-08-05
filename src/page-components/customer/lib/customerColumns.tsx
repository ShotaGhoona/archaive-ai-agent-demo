import React from 'react';
import Link from 'next/link';
import { Badge, Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/shared/shadcnui';
import { Eye, Edit, Trash2, MoreHorizontal, Phone } from 'lucide-react';
import { DataTableColumn } from '@/shared/basic-data-table';

export interface Customer {
  customerCode: string;
  customerName: string;
  contactPerson: string;
  salesRepresentative: string;
  phoneNumber: string;
  faxNumber: string;
  rank: 'S' | 'A' | 'B' | 'C';
  industry: string;
}

// ランクのバッジバリアントを取得する関数
export const getRankVariant = (rank: string) => {
  switch (rank) {
    case 'S': return 'default'; // 青系
    case 'A': return 'secondary'; // グレー系
    case 'B': return 'outline'; // アウトライン
    case 'C': return 'destructive'; // 赤系
    default: return 'outline';
  }
};

// 顧客管理用のコールバック型
export interface CustomerColumnCallbacks {
  onEdit?: (customer: Customer) => void;
  onDelete?: (customer: Customer) => void;
}

export const createCustomerColumns = (callbacks?: CustomerColumnCallbacks): DataTableColumn<Customer>[] => [
  {
    key: 'customerCode',
    label: '取引先コード',
    width: 140,
    sortable: true,
    editable: false,
    locked: true,
    sortType: 'string',
    render: (customer: Customer, value: unknown) => (
      <Link
        href={`/customers/${customer.customerCode}`}
        className="hover:underline font-mono text-sm font-medium text-primary"
        onClick={(e) => e.stopPropagation()}
      >
        {String(value)}
      </Link>
    ),
  },
  {
    key: 'customerName',
    label: '取引先名',
    width: 200,
    sortable: true,
    editable: true,
    locked: false,
    inputType: 'text',
    sortType: 'string',
    render: (customer: Customer, value: unknown) => (
      <div className="font-medium text-gray-900">
        {String(value)}
      </div>
    ),
  },
  {
    key: 'contactPerson',
    label: '取引先担当者',
    width: 120,
    sortable: true,
    editable: true,
    locked: false,
    inputType: 'text',
    sortType: 'string',
  },
  {
    key: 'salesRepresentative',
    label: '営業担当者',
    width: 120,
    sortable: true,
    editable: true,
    locked: false,
    inputType: 'text',
    sortType: 'string',
  },
  {
    key: 'phoneNumber',
    label: '電話番号',
    width: 130,
    sortable: false,
    editable: true,
    locked: false,
    inputType: 'text',
    render: (customer: Customer, value: unknown) => (
      <div className="flex items-center gap-1 text-sm">
        <Phone className="h-3 w-3 text-gray-400" />
        <span className="font-mono">{String(value)}</span>
      </div>
    ),
  },
  {
    key: 'faxNumber',
    label: 'FAX',
    width: 130,
    sortable: false,
    editable: true,
    locked: false,
    inputType: 'text',
    render: (customer: Customer, value: unknown) => (
      <div className="flex items-center gap-1 text-sm">
          <Phone className="h-3 w-3 text-gray-400" />
        <span className="font-mono">{String(value)}</span>
      </div>
    ),
  },
  {
    key: 'rank',
    label: 'ランク',
    width: 80,
    sortable: true,
    editable: true,
    locked: false,
    inputType: 'select',
    selectOptions: ['S', 'A', 'B', 'C'],
    sortType: 'string',
    render: (customer: Customer, value: unknown) => (
      <Badge variant={getRankVariant(value as string)} className="font-semibold">
        {String(value)}
      </Badge>
    ),
  },
  {
    key: 'industry',
    label: '業界',
    width: 120,
    sortable: true,
    editable: true,
    locked: false,
    inputType: 'select',
    selectOptions: [
      '自動車部品',
      '産業機械',
      '電子部品',
      '食品加工',
      '医療機器',
      '航空宇宙',
      'その他'
    ],
    sortType: 'string',
    render: (customer: Customer, value: unknown) => (
      <Badge variant="outline" className="text-xs">
        {String(value)}
      </Badge>
    ),
  },
  {
    key: 'actions',
    label: '操作',
    width: 80,
    minWidth: 80,
    sortable: false,
    editable: false,
    locked: false,
    render: (customer: Customer) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <Link href={`/customers/${customer.customerCode}`}>
            <DropdownMenuItem>
              <Eye className="h-4 w-4 mr-2" />
              詳細表示
            </DropdownMenuItem>
          </Link>
          <DropdownMenuItem onClick={() => callbacks?.onEdit?.(customer)}>
            <Edit className="h-4 w-4 mr-2" />
            編集
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="text-red-600"
            onClick={() => callbacks?.onDelete?.(customer)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            削除
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

// 後方互換性のため
export const CUSTOMER_COLUMNS = createCustomerColumns();