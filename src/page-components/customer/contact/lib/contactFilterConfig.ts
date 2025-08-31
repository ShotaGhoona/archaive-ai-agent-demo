import { FilterConfig } from '@/shared';
import { CustomerContactDataInterface } from '@/dummy-data-er-fix/customer';

export const CONTACT_FILTER_CONFIG: FilterConfig<CustomerContactDataInterface>[] = [
  {
    key: 'last_name',
    label: '姓',
    type: 'text',
    placeholder: '姓で検索',
  },
  {
    key: 'first_name',
    label: '名',
    type: 'text',
    placeholder: '名で検索',
  },
  {
    key: 'customer_contact_custom_items.役職.value',
    label: '役職',
    type: 'text',
    placeholder: '役職で検索',
  },
  {
    key: 'customer_contact_custom_items.部署.value',
    label: '部署名',
    type: 'text',
    placeholder: '部署名で検索',
  },
  {
    key: 'email_primary',
    label: '主要メールアドレス',
    type: 'text',
    placeholder: 'メールアドレスで検索',
  },
  {
    key: 'is_active',
    label: 'ステータス',
    type: 'select',
    options: ['有効', '無効'],
  },
  {
    key: 'updated_at',
    label: '最終更新日',
    type: 'dateRange',
    placeholder: '更新日で絞り込み',
  },
];
