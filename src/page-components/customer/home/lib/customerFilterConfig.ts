import { FilterConfig } from '@/shared';
import { Customer } from '../model';

export const CUSTOMER_FILTER_CONFIG: FilterConfig<Customer>[] = [
  {
    key: 'account_id',
    label: '取引先ID',
    type: 'text',
    placeholder: '取引先IDで検索'
  },
  {
    key: 'account_name',
    label: '取引先名',
    type: 'text',
    placeholder: '取引先名で検索'
  },
  {
    key: 'account_type',
    label: '取引先種別',
    type: 'select',
    placeholder: '取引先種別で絞り込み',
    options: [
      '製造業',
      '建設業',
      '電子部品製造業',
      '食品製造業',
      '医療機器製造業',
      '航空宇宙産業',
      '商社',
      '自動車部品製造業',
      '精密機械製造業',
      '電子機器製造業',
    ],
    defaultValue: 'all'
  },
  {
    key: 'status',
    label: 'ステータス',
    type: 'select',
    placeholder: 'ステータスで絞り込み',
    options: [
      'アクティブ',
      '非アクティブ',
      '休止中',
    ],
    defaultValue: 'all'
  },
  {
    key: 'annual_revenue',
    label: '年間売上高',
    type: 'number',
    placeholder: '年間売上高で絞り込み'
  },
  {
    key: 'employee_count',
    label: '従業員数',
    type: 'number',
    placeholder: '従業員数で絞り込み'
  },
  {
    key: 'created_at',
    label: '作成日時',
    type: 'date',
    placeholder: '作成日時で絞り込み'
  },
  {
    key: 'updated_at',
    label: '最終更新日時',
    type: 'date',
    placeholder: '最終更新日時で絞り込み'
  }
];