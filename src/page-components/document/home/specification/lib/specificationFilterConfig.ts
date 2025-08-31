import { FilterConfig } from '@/shared';
import { DocumentSpecificationDataInterface } from '@/dummy-data-er-fix/document';

export const SPECIFICATION_FILTER_CONFIG: FilterConfig<DocumentSpecificationDataInterface>[] = [
  {
    key: 'leaf_product_document_custom_items.仕様書番号.value',
    label: '仕様書番号',
    type: 'text',
    placeholder: '仕様書番号で検索',
  },
  {
    key: 'leaf_product_name',
    label: '製品名',
    type: 'text',
    placeholder: '製品名で検索',
  },
  {
    key: 'customer_name',
    label: '顧客名',
    type: 'text',
    placeholder: '顧客名で検索',
  },
  {
    key: 'leaf_product_document_custom_items.承認日.value',
    label: '承認日',
    type: 'date',
    placeholder: '承認日で絞り込み',
  },
  {
    key: 'leaf_product_document_custom_items.仕様分類.value',
    label: '仕様分類',
    type: 'select',
    placeholder: '仕様分類で絞り込み',
    options: ['機械仕様', '電気仕様', 'ソフトウェア仕様', '材料仕様', '品質仕様', 'システム仕様', '環境仕様', '安全仕様', 'パフォーマンス仕様', 'メンテナンス仕様'],
    defaultValue: 'all',
  },
  {
    key: 'leaf_product_document_custom_items.適用規格.value',
    label: '適用規格',
    type: 'text',
    placeholder: '適用規格で検索',
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
