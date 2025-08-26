import { FilterConfig } from '@/shared';
import { Inspection } from '../model';

export const INSPECTION_FILTER_CONFIG: FilterConfig<Inspection>[] = [
  {
    key: 'project_name',
    label: 'プロジェクト名',
    type: 'text',
    placeholder: 'プロジェクト名で検索'
  },
  {
    key: 'inspection_result',
    label: '検査結果',
    type: 'select',
    options: ['合格', '要再検査', '検査中', '検査待ち']
  },
  {
    key: 'approval_status',
    label: '承認状況',
    type: 'select',
    options: ['承認済み', '未承認', '差し戻し']
  },
  {
    key: 'inspection_items_count',
    label: '検査項目数',
    type: 'number',
    placeholder: '検査項目数で絞り込み'
  },
  {
    key: 'inspection_date',
    label: '検査日',
    type: 'date'
  }
];