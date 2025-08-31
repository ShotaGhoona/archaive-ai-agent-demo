import { DocumentDetailViewConfig } from '@/shared/view/document-detail-view';
import { DocumentOrderDataInterface } from '@/dummy-data-er-fix/document';

export const createOrderDetailConfig =
  (): DocumentDetailViewConfig<DocumentOrderDataInterface> => ({
    documentType: '受注書',

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
      enabled: false, // Order作成機能は未実装のため無効
    },

    // パネルカラム設定（TableViewのカラム設定と同様）
    panelColumnConfig: [
      {
        key: 'name',
        label: '受注書名',
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
        placeholder: '受注書に関する備考を入力',
      },
      {
        key: 'directory_document_custom_items.受注番号.value',
        label: '受注番号',
        inputType: 'text',
        editable: true,
        required: false,
      },
      {
        key: 'directory_document_custom_items.受注日.value',
        label: '受注日',
        inputType: 'date',
        editable: true,
        required: false,
      },
      {
        key: 'directory_document_custom_items.発注区分.value',
        label: '発注区分',
        inputType: 'select',
        editable: true,
        required: false,
        selectOptions: [
          { label: '新規発注', value: '新規発注' },
          { label: '追加発注', value: '追加発注' },
          { label: '緊急発注', value: '緊急発注' },
        ],
      },
      {
        key: 'directory_document_custom_items.納期条件.value',
        label: '納期条件',
        inputType: 'select',
        editable: true,
        required: false,
        selectOptions: [
          { label: '指定日厳守', value: '指定日厳守' },
          { label: '通常納期', value: '通常納期' },
          { label: '至急対応', value: '至急対応' },
        ],
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
