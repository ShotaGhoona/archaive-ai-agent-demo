import { CsvColumnConfig } from '@/shared';
import { Specification } from '../model';

export const SPECIFICATION_CSV_COLUMNS: Omit<CsvColumnConfig<Specification>, 'enabled'>[] = [
  { key: 'name', label: '帳票名' },
  { key: 'project_name', label: 'プロジェクト名' },
  { key: 'blueprint_name', label: '図面名' },
  { key: 'version', label: 'バージョン' },
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