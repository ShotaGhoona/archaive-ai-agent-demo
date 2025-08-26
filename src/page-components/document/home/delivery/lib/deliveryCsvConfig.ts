import { CsvColumnConfig } from '@/shared';
import { Delivery } from '../model';

export const DELIVERY_CSV_COLUMNS: Omit<CsvColumnConfig<Delivery>, 'enabled'>[] = [
  { key: 'name', label: '帳票名' },
  { key: 'project_name', label: 'プロジェクト名' },
  { key: 'delivery_destination', label: '納品先' },
  { key: 'delivery_date', label: '納品日',
    formatter: (value: unknown) => value ? new Date(value as string).toLocaleDateString('ja-JP') : '-'
  },
  { key: 'inspection_scheduled_date', label: '検収予定日',
    formatter: (value: unknown) => value ? new Date(value as string).toLocaleDateString('ja-JP') : '-'
  },
  { key: 'inspection_status', label: '検収状況' },
  {
    key: 'created_at',
    label: '作成日',
    formatter: (value: unknown) => new Date(value as string).toLocaleDateString('ja-JP')
  },
  {
    key: 'updated_at',
    label: '更新日',
    formatter: (value: unknown) => new Date(value as string).toLocaleDateString('ja-JP')
  }
];