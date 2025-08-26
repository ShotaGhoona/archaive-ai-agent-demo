import { FilterConfig } from '@/shared';
import { Delivery } from '../model';

export const DELIVERY_FILTER_CONFIG: FilterConfig<Delivery>[] = [
  {
    key: 'project_name',
    label: 'プロジェクト名',
    type: 'text',
    placeholder: 'プロジェクト名で検索'
  },
  {
    key: 'delivery_destination',
    label: '納品先',
    type: 'text',
    placeholder: '納品先で検索'
  },
  {
    key: 'inspection_status',
    label: '検収状況',
    type: 'select',
    options: ['検収完了', '検収待ち', '未納品']
  },
  {
    key: 'delivery_date',
    label: '納品日',
    type: 'date'
  },
  {
    key: 'inspection_scheduled_date',
    label: '検収予定日',
    type: 'date'
  }
];