import { DocumentDetailViewConfig } from '@/shared/view/document-detail-view';
import { DeliveryData } from '../model';

export const createDeliveryDetailConfig = (): DocumentDetailViewConfig<DeliveryData> => ({
  documentType: "納品書",
  
  // データアクセス設定
  dataConfig: {
    getItemId: (item) => item.delivery_id,
    getItemTitle: (item) => item.delivery_number,
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
    enabled: false,  // Delivery作成機能は未実装のため無効
  },
  
  // パネルカラム設定（TableViewのカラム設定と同様）
  panelColumnConfig: [
    {
      key: 'delivery_id',
      label: '納品書ID',
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
      key: 'delivery_number',
      label: '納品書番号',
      inputType: 'text',
      editable: true,
      required: true,
    },
    {
      key: 'delivery_date',
      label: '納品日',
      inputType: 'date',
      editable: true,
      required: true,
    },
    {
      key: 'delivery_address',
      label: '納品先',
      inputType: 'text',
      editable: true,
      required: true,
    },
    {
      key: 'delivery_details',
      label: '品目・数量',
      inputType: 'text',
      editable: true,
      required: false,
      placeholder: '納品内容の詳細を入力',
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