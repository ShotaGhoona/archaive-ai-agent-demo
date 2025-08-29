import { DocumentDetailViewConfig } from '@/shared/view/document-detail-view';
import { OrderData } from '../model';

export const createOrderDetailConfig = (): DocumentDetailViewConfig<OrderData> => ({
  documentType: "受注書",
  
  // データアクセス設定
  dataConfig: {
    getItemId: (item) => item.order_id,
    getItemTitle: (item) => item.order_number,
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
    enabled: false,  // Order作成機能は未実装のため無効
  },
  
  // パネルカラム設定（TableViewのカラム設定と同様）
  panelColumnConfig: [
    {
      key: 'order_id',
      label: '受注書ID',
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
      key: 'order_number',
      label: '受注番号',
      inputType: 'text',
      editable: true,
      required: true,
    },
    {
      key: 'order_date',
      label: '受注日',
      inputType: 'date',
      editable: true,
      required: true,
    },
    {
      key: 'customer_id',
      label: '顧客ID',
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
    },
  ],
});