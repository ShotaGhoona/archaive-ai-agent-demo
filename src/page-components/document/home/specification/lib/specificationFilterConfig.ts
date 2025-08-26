import { FilterConfig } from '@/shared';
import { Specification } from '../model';

export const SPECIFICATION_FILTER_CONFIG: FilterConfig<Specification>[] = [
  {
    key: 'project_name',
    label: 'プロジェクト名',
    type: 'text',
    placeholder: 'プロジェクト名で検索'
  },
  {
    key: 'blueprint_name',
    label: '図面名',
    type: 'text',
    placeholder: '図面名で検索'
  },
  {
    key: 'version',
    label: 'バージョン',
    type: 'text',
    placeholder: 'バージョンで検索'
  },
  {
    key: 'approval_status',
    label: '承認状況',
    type: 'select',
    options: ['承認済み', '未承認', '差し戻し']
  },
  {
    key: 'created_at',
    label: '作成日',
    type: 'date'
  }
];