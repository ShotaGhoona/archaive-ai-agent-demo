import { DocumentDetailViewConfig } from '@/shared/view/document-detail-view';
import { DocumentShippingDataInterface } from '@/dummy-data-er-fix/document';

export const createShippingDetailConfig =
  (): DocumentDetailViewConfig<DocumentShippingDataInterface> => ({
    documentType: '送り状',

    // データアクセス設定
    dataConfig: {
      getItemId: (item) => item.id.toString(),
      getItemTitle: (item) => item.name,
      getItemSubtitle: (item) => item.directory_name,
      getImageUrl: (item) => item.s3_url,
      getModifiedDate: (item) => item.updated_at,
    },

    // プレビューアクションボタン設定
    previewActionButtonsConfig: {
      showDeleteButton: true,
      showDownloadButton: true,
      showPrintButton: true,
    },

    createConfig: {
      enabled: false, // Shipping作成機能は未実装のため無効
    },

    // パネルカラム設定（TableViewのカラム設定と同様）
    panelColumnConfig: [
      {
        key: 'name',
        label: '送り状名',
        inputType: 'text',
        editable: true,
        required: true,
      },
      {
        key: 'directory_name',
        label: '案件名',
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
        placeholder: '送り状に関する備考を入力',
      },
      {
        key: 'directory_document_custom_items.送り状番号.value',
        label: '送り状番号',
        inputType: 'text',
        editable: true,
        required: false,
      },
      {
        key: 'directory_document_custom_items.出荷日.value',
        label: '出荷日',
        inputType: 'date',
        editable: true,
        required: false,
      },
      {
        key: 'directory_document_custom_items.配送業者.value',
        label: '配送業者',
        inputType: 'select',
        editable: true,
        required: false,
        selectOptions: [
          { label: 'ヤマト運輸', value: 'ヤマト運輸' },
          { label: '佐川急便', value: '佐川急便' },
          { label: '緊急便', value: '緊急便' },
        ],
      },
      {
        key: 'directory_document_custom_items.追跡番号.value',
        label: '追跡番号',
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
