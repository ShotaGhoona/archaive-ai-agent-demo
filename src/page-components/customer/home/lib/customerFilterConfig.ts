import { FilterConfig } from '@/shared';
import { CustomerHomeDataInterface } from '@/dummy-data-er-fix/customer';

export const CUSTOMER_FILTER_CONFIG: FilterConfig<CustomerHomeDataInterface>[] = [
  {
    key: 'seq_num',
    label: '取引先ID',
    type: 'number',
    placeholder: '顧客番号で検索',
  },
  {
    key: 'name',
    label: '取引先名',
    type: 'text',
    placeholder: '顧客名で検索',
  },
  {
    key: 'customer_status',
    label: 'ステータス',
    type: 'select',
    placeholder: 'ステータスで絞り込み',
    options: ['既存顧客', '見込み客', 'VIP顧客'],
    defaultValue: 'all',
  },
  {
    key: 'customer_custom_items.業界分類.value',
    label: '業界分類',
    type: 'select',
    placeholder: '業界分類で絞り込み',
    options: ['精密機械', '建設業', '電子部品', '食品製造', '医療機器', '航空宇宙', '商社', '自動車部品', '電子機器'],
  },
  {
    key: 'customer_custom_items.契約形態.value',
    label: '契約形態',
    type: 'select',
    placeholder: '契約形態で絞り込み',
    options: ['スポット契約', '年間契約', '継続契約', '季節契約', 'プロジェクト契約', '包括契約', '開発契約'],
  },
  {
    key: 'created_at',
    label: '作成日時',
    type: 'date',
    placeholder: '作成日時で絞り込み',
  },
  {
    key: 'updated_at',
    label: '最終更新日時',
    type: 'date',
    placeholder: '最終更新日時で絞り込み',
  },
];
