import { CsvColumnConfig } from '@/features/csv-export';
import { Project } from './projectColumns';

export const PROJECT_CSV_COLUMNS: Omit<CsvColumnConfig<Project>, 'enabled'>[] = [
  { key: 'projectId', label: '案件ID' },
  { key: 'customerName', label: '顧客名' },
  { key: 'assignee', label: '担当者' },
  { key: 'responseDeadline', label: '回答期日' },
  { key: 'workCompleteDate', label: '作業完了日' },
  { key: 'deliveryDeadline', label: '納品期日' },
  { key: 'receiptDate', label: '入荷期日' },
  { key: 'projectStatus', label: '案件状況' },
  { key: 'quotationStatus', label: '見積書ステータス' },
  { key: 'deliveryStatus', label: '納品書ステータス' },
  { key: 'lastUpdatedBy', label: '最終更新者' },
  { 
    key: 'lastUpdatedAt', 
    label: '最終更新日時',
    formatter: (value: string) => new Date(value).toLocaleString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  },
];