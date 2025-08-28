import { FilterConfig } from "@/shared";
import { Contact } from "../model";

export const CONTACT_FILTER_CONFIG: FilterConfig<Contact>[] = [
  {
    key: 'last_name',
    label: '姓',
    type: 'text',
    placeholder: '姓で検索'
  },
  {
    key: 'first_name',
    label: '名',
    type: 'text',
    placeholder: '名で検索'
  },
  {
    key: 'title',
    label: '役職',
    type: 'text',
    placeholder: '役職で検索'
  },
  {
    key: 'department',
    label: '部署名',
    type: 'text',
    placeholder: '部署名で検索'
  },
  {
    key: 'email_primary',
    label: '主要メールアドレス',
    type: 'text',
    placeholder: 'メールアドレスで検索'
  },
  {
    key: 'status',
    label: 'ステータス',
    type: 'select',
    options: [
      '有効',
      '無効'
    ]
  },
  {
    key: 'owner_user_id',
    label: '担当営業',
    type: 'text',
    placeholder: '担当営業で検索'
  },
  {
    key: 'modified_date',
    label: '最終更新日',
    type: 'dateRange',
    placeholder: '更新日で絞り込み'
  }
];