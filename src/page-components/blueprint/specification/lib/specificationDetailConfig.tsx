import { DocumentDetailViewConfig } from '@/shared/view/document-detail-view';
import { SpecificationData } from '../model';

export const createSpecificationDetailConfig = (): DocumentDetailViewConfig<SpecificationData> => ({
  documentType: "仕様書",
  
  // データアクセス設定
  dataConfig: {
    getItemId: (item) => item.specification_id,
    getItemTitle: (item) => item.specification_id,  // 仕様書は番号がないのでIDを表示
    getItemSubtitle: (item) => item.product_id,     // 製品IDをサブタイトルに
    getImageUrl: (item) => item.image_url,
  },
  
  // プレビューアクションボタン設定
  previewActionButtonsConfig: {
    showDeleteButton: true,
    showDownloadButton: true,
    showPrintButton: true,
  },
  
  createConfig: {
    enabled: false,  // Specification作成機能は未実装のため無効
  },
  
  // パネルカラム設定（TableViewのカラム設定と同様）
  panelColumnConfig: [
    {
      key: 'specification_id',
      label: '仕様書ID',
      inputType: 'text',
      editable: false,
      required: true,
    },
    {
      key: 'product_id',
      label: '製品ID',
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
      placeholder: '仕様書に関する備考を入力',
    },
  ],
});