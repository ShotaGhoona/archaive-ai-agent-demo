import { FilterConfig } from '@/shared';
import { DocumentQuotationDataInterface } from '@/dummy-data-er-fix/document';

export const QUOTATION_FILTER_CONFIG: FilterConfig<DocumentQuotationDataInterface>[] = [
  {
    key: 'quotation_number',
    label: '見積書番号',
    type: 'text',
    placeholder: '見積書番号で検索',
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
    key: 'company_name',
    label: '会社名',
    type: 'text',
    placeholder: '会社名で検索',
  },
  {
    key: 'expiration_date',
    label: '有効期限',
    type: 'date',
    placeholder: '有効期限で絞り込み',
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
