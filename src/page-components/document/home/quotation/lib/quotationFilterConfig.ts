import { FilterConfig } from '@/shared';
import { Quotation } from '../model';

export const QUOTATION_FILTER_CONFIG: FilterConfig<Quotation>[] = [
  {
    key: 'customer_name',
    label: '顧客名',
    type: 'text',
    placeholder: '顧客名で検索'
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
    key: 'quotation_date',
    label: '見積日',
    type: 'date',
    placeholder: '見積日で絞り込み'
  },
  {
    key: 'amount',
    label: '見積金額',
    type: 'number',
    placeholder: '金額で絞り込み'
  }
];