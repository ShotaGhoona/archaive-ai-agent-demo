import { FilterConfig } from '@/shared';
import { Order } from '../model';

export const ORDER_FILTER_CONFIG: FilterConfig<Order>[] = [
  {
    key: 'supplier_name',
    label: '発注先',
    type: 'text',
    placeholder: '発注先で検索'
  },
  {
    key: 'project_name',
    label: '案件名',
    type: 'text',
    placeholder: '案件名で検索'
  },
  {
    key: 'approval_status',
    label: '承認状況',
    type: 'select',
    options: ['未承認', '承認済み', '却下']
  },
  {
    key: 'order_date',
    label: '発注日',
    type: 'date',
    placeholder: '発注日で絞り込み'
  },
  {
    key: 'order_amount',
    label: '発注金額',
    type: 'number',
    placeholder: '金額で絞り込み'
  }
];