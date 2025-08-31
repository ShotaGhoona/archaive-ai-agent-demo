import { DocumentDetailViewConfig } from '@/shared/view/document-detail-view';
import { DocumentDeliveryDataInterface } from '@/dummy-data-er-fix/document';

export const createDeliveryDetailConfig =
  (): DocumentDetailViewConfig<DocumentDeliveryDataInterface> => ({
    documentType: '納品書',

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
      enabled: false, // Delivery作成機能は未実装のため無効
    },

    // パネルカラム設定（TableViewのカラム設定と同様）
    panelColumnConfig: [
      {
        key: 'name',
        label: '納品書名',
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
        placeholder: '納品書に関する備考を入力',
      },
      {
        key: 'directory_document_custom_items.納品書番号.value',
        label: '納品書番号',
        inputType: 'text',
        editable: true,
        required: false,
      },
      {
        key: 'directory_document_custom_items.納品日.value',
        label: '納品日',
        inputType: 'date',
        editable: true,
        required: false,
      },
      {
        key: 'directory_document_custom_items.納品先.value',
        label: '納品先',
        inputType: 'select',
        editable: true,
        required: false,
        selectOptions: [
          { label: '本社工場', value: '本社工場' },
          { label: '第二工場', value: '第二工場' },
          { label: '緊急対応窓口', value: '緊急対応窓口' },
        ],
      },
      {
        key: 'directory_document_custom_items.品目・数量.value',
        label: '品目・数量',
        inputType: 'text',
        editable: true,
        required: false,
        placeholder: '納品内容の詳細を入力',
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
