import React from 'react';
import Link from 'next/link';
import { Badge, Button, DataTableColumn } from '@/shared';
import { ExternalLink } from 'lucide-react';
import { TableViewConfig } from '@/shared/view/table-view';

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

export const createCustomerTableConfig = (): TableViewConfig<Customer> => ({
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
      render: (customer: Customer) => (
        <Link href={`/customer/${customer.customerCode}`}>
          <Button size="sm" variant="outline" className="h-8 text-primary font-bold hover:text-primary/80">
            <ExternalLink className="h-3 w-3" />
            開く
          </Button>
        </Link>
      ),
    },
    {
      key: 'customerCode',
      label: '取引先コード',
      width: 140,
      sortable: true,
      editable: false,
      locked: true,
      sortType: 'string',
      render: (customer: Customer, value: unknown) => (
        <span className="font-mono text-sm font-medium">
          {String(value)}
        </span>
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
  ],
  pagination: {
    enabled: true,
    defaultItemsPerPage: 20,
    allowedItemsPerPage: [10, 20, 50, 100],
    showItemsPerPageSelector: true,
    maxVisiblePages: 7,
  },
});

// 後方互換性のため
export const CUSTOMER_COLUMNS = createCustomerTableConfig().columns;