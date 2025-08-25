import { FilterConfig } from "@/features";
import { Contact } from "../lib";

export const CONTACT_FILTER_CONFIG: FilterConfig<Contact>[] = [
  {
    key: 'name',
    label: '担当者名',
    type: 'text',
    placeholder: '担当者名で検索'
  },
  {
    key: 'email',
    label: 'メールアドレス',
    type: 'text',
    placeholder: 'メールアドレスで検索'
  },
  {
    key: 'updated_at',
    label: '更新日',
    type: 'dateRange',
    placeholder: '更新日で絞り込み'
  }
];