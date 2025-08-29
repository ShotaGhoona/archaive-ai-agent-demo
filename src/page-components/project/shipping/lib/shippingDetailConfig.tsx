import { DocumentDetailViewConfig } from '@/shared/view/document-detail-view';
import { ShippingData } from '../model';

export const createShippingDetailConfig = (): DocumentDetailViewConfig<ShippingData> => ({
  documentType: "送り状",
  
  // データアクセス設定
  dataConfig: {
    getItemId: (item) => item.shipping_note_id,
    getItemTitle: (item) => item.shipping_note_id,  // 送り状は番号がないのでIDを表示
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
    enabled: false,  // Shipping作成機能は未実装のため無効
  },
  
  // パネルカラム設定（TableViewのカラム設定と同様）
  panelColumnConfig: [
    {
      key: 'shipping_note_id',
      label: '送り状ID',
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
      key: 'shipping_date',
      label: '出荷日',
      inputType: 'date',
      editable: true,
      required: false,
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
      placeholder: '送り状に関する備考を入力',
    },
  ],
});