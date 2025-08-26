import { CsvColumnConfig } from '@/shared';
import { Inspection } from '../model';

export const INSPECTION_CSV_COLUMNS: Omit<CsvColumnConfig<Inspection>, 'enabled'>[] = [
  { key: 'name', label: '帳票名' },
  { key: 'project_name', label: 'プロジェクト名' },
  { key: 'inspection_items_count', label: '検査項目数' },
  { key: 'inspection_date', label: '検査日',
    formatter: (value: unknown) => value ? new Date(value as string).toLocaleDateString('ja-JP') : '-'
  },
  { key: 'inspection_result', label: '検査結果' },
  { key: 'approval_status', label: '承認状況' },
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