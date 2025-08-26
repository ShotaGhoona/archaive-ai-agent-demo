import { CsvColumnConfig } from '@/shared';
import { ProcessMaster } from '../lib';

export const PROCESS_MASTER_CSV_COLUMNS: Omit<CsvColumnConfig<ProcessMaster>, 'enabled'>[] = [
  { key: 'id', label: 'ID' },
  { key: 'processName', label: '工程名' },
  { key: 'processCategory', label: '工程分類' },
  { key: 'customFormula', label: 'カスタム式' },
  { key: 'remarks', label: '備考' },
  { 
    key: 'updatedAt', 
    label: '更新日時',
    formatter: (value: unknown) => new Date(String(value)).toLocaleString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  },
];