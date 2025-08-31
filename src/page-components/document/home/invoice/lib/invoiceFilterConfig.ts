import { FilterConfig } from '@/shared';
import { DocumentInvoiceDataInterface } from '@/dummy-data-er-fix/document';

export const INVOICE_FILTER_CONFIG: FilterConfig<DocumentInvoiceDataInterface>[] = [
  {
    key: 'directory_document_custom_items.請求書番号.value',
    label: '請求書番号',
    type: 'text',
    placeholder: '請求書番号で検索',
  },
  {
    key: 'directory_name',
    label: 'プロジェクト名',
    type: 'text',
    placeholder: 'プロジェクト名で検索',
  },
  {
    key: 'customer_name',
    label: '顧客名',
    type: 'text',
    placeholder: '顧客名で検索',
  },
  {
    key: 'directory_document_custom_items.請求日.value',
    label: '請求日',
    type: 'date',
    placeholder: '請求日で絞り込み',
  },
  {
    key: 'directory_document_custom_items.支払条件.value',
    label: '支払条件',
    type: 'select',
    placeholder: '支払条件で絞り込み',
    options: ['月末締め翌月末払い', '翌月15日払い', '60日後払い', '即日払い', '分割払い可', '前払い', '現金決済', '手形決済', '振込決済', '小切手決済'],
    defaultValue: 'all',
  },
  {
    key: 'directory_document_custom_items.請求金額.value',
    label: '請求金額',
    type: 'text',
    placeholder: '請求金額で検索',
  },
  {
    key: 'name',
    label: 'ドキュメント名',
    type: 'text',
    placeholder: 'ドキュメント名で検索',
  },
  {
    key: 'version',
    label: 'バージョン',
    type: 'number',
    placeholder: 'バージョンで絞り込み',
  },
  {
    key: 'created_at',
    label: '作成日時',
    type: 'date',
    placeholder: '作成日時で絞り込み',
  },
  {
    key: 'updated_at',
    label: '最終更新日時',
    type: 'date',
    placeholder: '最終更新日時で絞り込み',
  },
];
