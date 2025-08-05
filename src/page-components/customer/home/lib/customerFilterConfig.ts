import { FilterConfig } from '@/features/advanced-filter';
import { Customer } from './customerColumns';

export const CUSTOMER_FILTER_CONFIG: FilterConfig<Customer>[] = [
  {
    key: 'customerCode',
    label: '取引先コード',
    type: 'text',
    placeholder: 'コードで検索'
  },
  {
    key: 'customerName',
    label: '取引先名',
    type: 'text',
    placeholder: '会社名で検索'
  },
  {
    key: 'contactPerson',
    label: '取引先担当者',
    type: 'text',
    placeholder: '担当者名で検索'
  },
  {
    key: 'salesRepresentative',
    label: '営業担当者',
    type: 'text',
    placeholder: '営業担当で検索'
  },
  {
    key: 'phoneNumber',
    label: '電話番号',
    type: 'text',
    placeholder: '電話番号で検索'
  },
  {
    key: 'faxNumber',
    label: 'FAX番号',
    type: 'text',
    placeholder: 'FAX番号で検索'
  },
  {
    key: 'rank',
    label: 'ランク',
    type: 'select',
    options: ['S', 'A', 'B', 'C'],
    defaultValue: 'all'
  },
  {
    key: 'industry',
    label: '業界',
    type: 'select',
    options: [
      '自動車部品',
      '産業機械',
      '電子部品',
      '食品加工',
      '医療機器',
      '航空宇宙',
      'その他'
    ],
    defaultValue: 'all'
  }
];