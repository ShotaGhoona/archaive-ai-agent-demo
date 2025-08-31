import { FilterConfig } from '@/shared';
import { DocumentOrderDataInterface } from '@/dummy-data-er-fix/document';

export const ORDER_FILTER_CONFIG: FilterConfig<DocumentOrderDataInterface>[] = [
  {
    key: 'directory_document_custom_items.受注番号.value',
    label: '受注番号',
    type: 'text',
    placeholder: '受注番号で検索',
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
    key: 'directory_document_custom_items.受注日.value',
    label: '受注日',
    type: 'date',
    placeholder: '受注日で絞り込み',
  },
  {
    key: 'directory_document_custom_items.発注区分.value',
    label: '発注区分',
    type: 'select',
    placeholder: '発注区分で絞り込み',
    options: ['新規発注', '開発案件', '量産発注', '研究開発', 'システム発注', '特注発注', '大型システム', '設備発注', '精密機器', 'カスタム発注'],
    defaultValue: 'all',
  },
  {
    key: 'directory_document_custom_items.納期条件.value',
    label: '納期条件',
    type: 'select',
    placeholder: '納期条件で絞り込み',
    options: ['指定日厳守', 'プロトタイプ優先', '分割納期可', '段階納期', '設置工事込み', '検査証明付き', '段階検収', '分割納入可', '校正証明必須', '動作確認済み'],
    defaultValue: 'all',
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
