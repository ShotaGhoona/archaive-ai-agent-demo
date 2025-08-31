import { DocumentDetailViewConfig } from '@/shared/view/document-detail-view';
import { DocumentSpecificationDataInterface } from '@/dummy-data-er-fix/document';

export const createSpecificationDetailConfig =
  (): DocumentDetailViewConfig<DocumentSpecificationDataInterface> => ({
    documentType: '仕様書',

    // データアクセス設定
    dataConfig: {
      getItemId: (item) => item.id.toString(),
      getItemTitle: (item) => item.name,
      getItemSubtitle: (item) => item.leaf_product_name,
      getImageUrl: (item) => item.s3_url, // s3_urlを使用
      getModifiedDate: (item) => item.updated_at,
    },

    // プレビューアクションボタン設定
    previewActionButtonsConfig: {
      showDeleteButton: true,
      showDownloadButton: true,
      showPrintButton: true,
    },

    createConfig: {
      enabled: false, // Specification作成機能は未実装のため無効
    },

    // パネルカラム設定（TableViewのカラム設定と同様）
    panelColumnConfig: [
      {
        key: 'name',
        label: '仕様書名',
        inputType: 'text',
        editable: true,
        required: true,
      },
      {
        key: 'leaf_product_name',
        label: '製品名',
        inputType: 'text',
        editable: false,
        required: true,
      },
      {
        key: 'customer_name',
        label: '顧客名',
        inputType: 'text',
        editable: false,
        required: true,
      },
      {
        key: 'version',
        label: 'バージョン',
        inputType: 'number',
        editable: false,
        required: true,
      },
      {
        key: 'remarks',
        label: '備考',
        inputType: 'text',
        editable: true,
        required: false,
        placeholder: '仕様書に関する備考を入力',
      },
      {
        key: 'leaf_product_document_custom_items.仕様書種別.value',
        label: '仕様書種別',
        inputType: 'select',
        editable: true,
        required: false,
        selectOptions: [
          { label: '機械仕様書', value: '機械仕様書' },
          { label: '電気仕様書', value: '電気仕様書' },
          { label: '安全仕様書', value: '安全仕様書' },
          { label: '製品仕様書', value: '製品仕様書' },
          { label: '設計仕様書', value: '設計仕様書' },
        ],
      },
      {
        key: 'leaf_product_document_custom_items.承認ステータス.value',
        label: '承認ステータス',
        inputType: 'select',
        editable: true,
        required: false,
        selectOptions: [
          { label: '承認済み', value: '承認済み' },
          { label: '審査中', value: '審査中' },
          { label: '下書き', value: '下書き' },
          { label: '差し戻し', value: '差し戻し' },
        ],
      },
      {
        key: 'leaf_product_document_custom_items.技術レベル.value',
        label: '技術レベル',
        inputType: 'text',
        editable: true,
        required: false,
      },
      {
        key: 'created_by_name',
        label: '作成者',
        inputType: 'text',
        editable: false,
        required: false,
      },
      {
        key: 'updated_by_name',
        label: '更新者',
        inputType: 'text',
        editable: false,
        required: false,
      },
      {
        key: 'created_at',
        label: '作成日時',
        inputType: 'text',
        editable: false,
        required: false,
      },
      {
        key: 'updated_at',
        label: '更新日時',
        inputType: 'text',
        editable: false,
        required: false,
      },
    ],
  });