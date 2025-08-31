import { DocumentDetailViewConfig } from '@/shared/view/document-detail-view';
import { DocumentInvoiceDataInterface } from '@/dummy-data-er-fix/document';

export const createInvoiceDetailConfig =
  (): DocumentDetailViewConfig<DocumentInvoiceDataInterface> => ({
    documentType: '請求書',

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
      enabled: false, // Invoice作成機能は未実装のため無効
    },

    // パネルカラム設定（TableViewのカラム設定と同様）
    panelColumnConfig: [
      {
        key: 'name',
        label: '請求書名',
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
        placeholder: '請求書に関する備考を入力',
      },
      {
        key: 'directory_document_custom_items.請求書番号.value',
        label: '請求書番号',
        inputType: 'text',
        editable: true,
        required: false,
      },
      {
        key: 'directory_document_custom_items.請求日.value',
        label: '請求日',
        inputType: 'date',
        editable: true,
        required: false,
      },
      {
        key: 'directory_document_custom_items.支払条件.value',
        label: '支払条件',
        inputType: 'select',
        editable: true,
        required: false,
        selectOptions: [
          { label: '月末締め翌月末払い', value: '月末締め翌月末払い' },
          { label: '即時支払い', value: '即時支払い' },
        ],
      },
      {
        key: 'directory_document_custom_items.請求金額.value',
        label: '請求金額',
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
