import { FilterConfig } from '@/shared';
import { Project } from '../lib';

export const PROJECT_FILTER_CONFIG: FilterConfig<Project>[] = [
  {
    key: 'projectId',
    label: '案件ID',
    type: 'text',
    placeholder: '案件IDを入力'
  },
  {
    key: 'customerName',
    label: '顧客名',
    type: 'text',
    placeholder: '顧客名を入力'
  },
  {
    key: 'assignee',
    label: '担当者',
    type: 'text',
    placeholder: '担当者を入力'
  },
  {
    key: 'responseDeadline',
    label: '回答期日',
    type: 'dateRange'
  },
  {
    key: 'workCompleteDate',
    label: '作業完了日',
    type: 'dateRange'
  },
  {
    key: 'deliveryDeadline',
    label: '納品期日',
    type: 'dateRange'
  },
  {
    key: 'receiptDate',
    label: '入荷期日',
    type: 'dateRange'
  },
  {
    key: 'projectStatus',
    label: '案件状況',
    type: 'select',
    options: ['問い合わせ', '見積もり中', '納品'],
    defaultValue: 'all'
  },
  {
    key: 'quotationStatus',
    label: '見積書ステータス',
    type: 'select',
    options: ['未提出', '作成中', '提出済'],
    defaultValue: 'all'
  },
  {
    key: 'deliveryStatus',
    label: '納品書ステータス',
    type: 'select',
    options: ['未対応', '配送準備中', '配送中', '配送完了'],
    defaultValue: 'all'
  },
  {
    key: 'lastUpdatedBy',
    label: '最終更新者',
    type: 'text',
    placeholder: '最終更新者を入力'
  },
  {
    key: 'lastUpdatedAt',
    label: '最終更新日時',
    type: 'datetime-local'
  }
];