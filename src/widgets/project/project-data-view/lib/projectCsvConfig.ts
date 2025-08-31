import { CsvColumnConfig } from '@/shared';
import { DirectoryBaseDataInterface } from '@/dummy-data-er-fix/project';

export const PROJECT_CSV_COLUMNS: Omit<
  CsvColumnConfig<DirectoryBaseDataInterface>,
  'enabled'
>[] = [
  { key: 'id', label: '案件ID' },
  { key: 'customer_name', label: '顧客名' },
  { key: 'directory_custom_items.担当者.value', label: '担当者' },
  { key: 'directory_custom_items.回答期限.value', label: '回答期日' },
  { key: 'directory_custom_items.作業完了日.value', label: '作業完了日' },
  { key: 'directory_custom_items.納品期限.value', label: '納品期日' },
  { key: 'directory_custom_items.受注日.value', label: '受注日' },
  { key: 'directory_custom_items.案件ステータス.value', label: '案件状況' },
  { key: 'directory_custom_items.見積書ステータス.value', label: '見積書ステータス' },
  { key: 'directory_custom_items.納品書ステータス.value', label: '納品書ステータス' },
  { key: 'updated_by_name', label: '最終更新者' },
  {
    key: 'updated_at',
    label: '最終更新日時',
    formatter: (value: unknown) =>
      new Date(String(value)).toLocaleString('ja-JP', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }),
  },
];
