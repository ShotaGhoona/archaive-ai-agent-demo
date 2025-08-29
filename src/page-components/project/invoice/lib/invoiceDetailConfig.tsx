import { DocumentDetailViewConfig } from '@/shared/view/document-detail-view';
import { InvoiceData } from '../model';

export const createInvoiceDetailConfig = (): DocumentDetailViewConfig<InvoiceData> => ({
  documentType: "請求書",
  
  // データアクセス設定
  dataConfig: {
    getItemId: (item) => item.invoice_id,
    getItemTitle: (item) => item.invoice_id,  // 請求書は番号がないのでIDを表示
    getItemSubtitle: (item) => item.project_id,
    getImageUrl: (item) => item.image_url,
  },
  
  // プレビューアクションボタン設定
  previewActionButtonsConfig: {
    showDeleteButton: true,
    showDownloadButton: true,
    showPrintButton: true,
  },
  
  createConfig: {
    enabled: false,  // Invoice作成機能は未実装のため無効
  },
  
  // パネルカラム設定（TableViewのカラム設定と同様）
  panelColumnConfig: [
    {
      key: 'invoice_id',
      label: '請求書ID',
      inputType: 'text',
      editable: false,
      required: true,
    },
    {
      key: 'project_id',
      label: '案件ID',
      inputType: 'text',
      editable: true,
      required: true,
    },
    {
      key: 'created_date',
      label: '作成日時',
      inputType: 'text',
      editable: false,
      required: false,
    },
    {
      key: 'created_user_id',
      label: '作成者',
      inputType: 'text',
      editable: false,
      required: false,
    },
    {
      key: 'modified_date',
      label: '更新日時',
      inputType: 'text',
      editable: false,
      required: false,
    },
    {
      key: 'modified_user_id',
      label: '更新者',
      inputType: 'text',
      editable: false,
      required: false,
    },
    {
      key: 'remarks',
      label: '備考',
      inputType: 'text',
      editable: true,
      required: false,
      placeholder: '請求書に関する備考を入力',
    },
  ],
});