import { FilterConfig } from '@/features';
import { Customer } from '../lib';

export const CUSTOMER_FILTER_CONFIG: FilterConfig<Customer>[] = [
  {
    key: 'name',
    label: '顧客名',
    type: 'text',
    placeholder: '顧客名で検索'
  },
  {
    key: 'updated_at',
    label: '更新日',
    type: 'date',
    placeholder: '更新日で絞り込み'
  }
];