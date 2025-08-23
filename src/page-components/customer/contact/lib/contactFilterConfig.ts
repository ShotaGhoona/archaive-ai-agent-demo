import { FilterConfig } from "@/features";
import { Contact } from "../lib";

export const CONTACT_FILTER_CONFIG: FilterConfig<Contact>[] = [
  {
    key: 'contactName',
    label: '連絡先名',
    type: 'text',
    placeholder: '氏名で検索'
  },
  {
    key: 'department',
    label: '部門',
    type: 'select',
    options: [
      '営業部',
      '技術部', 
      '製造部',
      '品質管理部',
      '経理部',
      '総務部',
      '企画部',
      'その他'
    ],
    defaultValue: 'all'
  },
  {
    key: 'position',
    label: '役職',
    type: 'select',
    options: [
      '取締役',
      '部長',
      '課長',
      '係長',
      '主任',
      '担当者',
      'その他'
    ],
    defaultValue: 'all'
  },
  {
    key: 'contactType',
    label: '連絡先タイプ',
    type: 'select',
    options: ['primary', 'secondary', 'emergency'],
    defaultValue: 'all'
  },
  {
    key: 'isActive',
    label: 'ステータス',
    type: 'select',
    options: ['true', 'false'],
    defaultValue: 'all'
  }
];