/**
 * Blueprint詳細フォーム設定
 * BlueprintDetailDataInterfaceに基づく動的フォーム生成設定
 */

export interface PanelColumnConfig {
  key: string;
  label: string;
  inputType: 'text' | 'number' | 'date' | 'select' | 'textarea';
  editable: boolean;
  required?: boolean;
  options?: Array<{ label: string; value: string | number }>;
}

export interface FormSection {
  sectionKey: string;
  sectionLabel: string;
  fields: PanelColumnConfig[];
}

export const blueprintBasicInformationConfig: FormSection[] = [
  // 基本情報セクション
  {
    sectionKey: 'basic',
    sectionLabel: '基本情報',
    fields: [
      {
        key: 'drawing_file_name',
        label: 'ファイル名',
        inputType: 'text',
        editable: false,
      },
      {
        key: 'page_number',
        label: 'ページ番号',
        inputType: 'number',
        editable: true,
        required: true,
      },
      {
        key: 'drawing_number',
        label: '図面番号',
        inputType: 'text',
        editable: true,
        required: true,
      },
      {
        key: 'external_drawing_number',
        label: '外部図面番号',
        inputType: 'text',
        editable: true,
      },
      {
        key: 'drawing_file_extension',
        label: 'ファイル形式',
        inputType: 'select',
        editable: true,
        options: [
          { label: 'DWG', value: 'dwg' },
          { label: 'STEP', value: 'step' },
          { label: 'IGS', value: 'igs' },
          { label: 'PDF', value: 'pdf' },
        ],
      },
      {
        key: 'drawing_category_name',
        label: '図面カテゴリ',
        inputType: 'select',
        editable: true,
        options: [
          { label: '本図面', value: '本図面' },
          { label: '見積図面', value: '見積図面' },
          { label: '検査図面', value: '検査図面' },
          { label: '手配図面', value: '手配図面' },
          { label: '工程図面', value: '工程図面' },
          { label: 'その他', value: 'その他' },
        ],
      },
      {
        key: 'leaf_product_name',
        label: '製品名',
        inputType: 'text',
        editable: true,
        required: true,
      },
      {
        key: 'leaf_product_revision_number',
        label: 'リビジョン番号',
        inputType: 'number',
        editable: true,
      },
      {
        key: 'customer_name',
        label: '顧客名',
        inputType: 'text',
        editable: true,
        required: true,
      },
      {
        key: 'remarks',
        label: '備考',
        inputType: 'textarea',
        editable: true,
      },
    ],
  },
  
  // カスタム項目セクション（動的生成）
  {
    sectionKey: 'custom',
    sectionLabel: 'カスタム項目',
    fields: [], // 動的に生成
  },
  
  // システム情報セクション
  {
    sectionKey: 'system',
    sectionLabel: 'システム情報',
    fields: [
      {
        key: 'created_by_name',
        label: '作成者',
        inputType: 'text',
        editable: false,
      },
      {
        key: 'updated_by_name',
        label: '最終更新者',
        inputType: 'text',
        editable: false,
      },
      {
        key: 'created_at',
        label: '作成日時',
        inputType: 'text',
        editable: false,
      },
      {
        key: 'updated_at',
        label: '最終更新日時',
        inputType: 'text',
        editable: false,
      },
    ],
  },
];

/**
 * セクションキーから設定を取得
 */
export function getFormSectionByKey(sectionKey: string): FormSection | undefined {
  return blueprintBasicInformationConfig.find(section => section.sectionKey === sectionKey);
}