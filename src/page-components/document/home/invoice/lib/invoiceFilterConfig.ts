import { FilterConfig } from '@/shared';
import { Invoice } from '../model';

export const INVOICE_FILTER_CONFIG: FilterConfig<Invoice>[] = [
  {
    key: 'project_name',
    label: 'プロジェクト名',
    type: 'text',
    placeholder: 'プロジェクト名で検索'
  },
  {
    key: 'billing_destination',
    label: '請求先',
    type: 'text',
    placeholder: '請求先で検索'
  },
  {
    key: 'payment_status',
    label: '支払状況',
    type: 'select',
    options: ['支払済み', '未払い']
  },
  {
    key: 'billing_amount',
    label: '請求金額',
    type: 'number',
    placeholder: '金額で絞り込み'
  },
  {
    key: 'billing_date',
    label: '請求日',
    type: 'date'
  },
  {
    key: 'payment_due_date',
    label: '支払期限',
    type: 'date'
  }
];