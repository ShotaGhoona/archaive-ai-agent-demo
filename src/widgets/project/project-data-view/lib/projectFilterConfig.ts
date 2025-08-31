import { FilterConfig } from '@/shared';
import { DirectoryBaseDataInterface } from '@/dummy-data-er-fix/project';

export const PROJECT_FILTER_CONFIG: FilterConfig<DirectoryBaseDataInterface>[] = [
  {
    key: 'id',
    label: '案件ID',
    type: 'text',
    placeholder: '案件IDを入力',
  },
  {
    key: 'customer_name',
    label: '顧客名',
    type: 'text',
    placeholder: '顧客名を入力',
  },
  {
    key: 'directory_custom_items.担当者.value',
    label: '担当者',
    type: 'text',
    placeholder: '担当者を入力',
  },
  {
    key: 'directory_custom_items.回答期限.value',
    label: '回答期日',
    type: 'dateRange',
  },
  {
    key: 'directory_custom_items.作業完了日.value',
    label: '作業完了日',
    type: 'dateRange',
  },
  {
    key: 'directory_custom_items.納品期限.value',
    label: '納品期日',
    type: 'dateRange',
  },
  {
    key: 'directory_custom_items.受注日.value',
    label: '受注日',
    type: 'dateRange',
  },
  {
    key: 'directory_custom_items.案件ステータス.value',
    label: '案件状況',
    type: 'select',
    options: ['問い合わせ', '見積もり中', '受注確定', '製作中', '納品完了'],
    defaultValue: 'all',
  },
  {
    key: 'directory_custom_items.見積書ステータス.value',
    label: '見積書ステータス',
    type: 'select',
    options: ['未提出', '作成中', '提出済'],
    defaultValue: 'all',
  },
  {
    key: 'directory_custom_items.納品書ステータス.value',
    label: '納品書ステータス',
    type: 'select',
    options: ['未対応', '配送準備中', '配送中', '配送完了'],
    defaultValue: 'all',
  },
  {
    key: 'updated_by_name',
    label: '最終更新者',
    type: 'text',
    placeholder: '最終更新者を入力',
  },
  {
    key: 'updated_at',
    label: '最終更新日時',
    type: 'datetime-local',
  },
];
