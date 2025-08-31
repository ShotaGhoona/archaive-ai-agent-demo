import { FilterConfig } from '@/shared';
import { DocumentDeliveryDataInterface } from '@/dummy-data-er-fix/document';

export const DELIVERY_FILTER_CONFIG: FilterConfig<DocumentDeliveryDataInterface>[] = [
  {
    key: 'directory_document_custom_items.納品書番号.value',
    label: '納品書番号',
    type: 'text',
    placeholder: '納品書番号で検索',
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
    key: 'directory_document_custom_items.納品先.value',
    label: '納品先',
    type: 'select',
    placeholder: '納品先で絞り込み',
    options: ['本社工場', '第二工場', '検査室', '研究開発部', '組立ライン', '品質管理部', '製造現場', '計測室', '電子回路部'],
    defaultValue: 'all',
  },
  {
    key: 'directory_document_custom_items.納品日.value',
    label: '納品日',
    type: 'date',
    placeholder: '納品日で絞り込み',
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
