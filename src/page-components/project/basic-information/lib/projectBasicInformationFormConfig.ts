/**
 * Project詳細フォーム設定
 * ProjectDetailDataInterfaceに基づく動的フォーム生成設定
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

export const projectBasicInformationConfig: FormSection[] = [
  // 基本情報セクション
  {
    sectionKey: 'basic',
    sectionLabel: '基本情報',
    fields: [
      {
        key: 'name',
        label: '案件名',
        inputType: 'text',
        editable: true,
        required: true,
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
  return projectBasicInformationConfig.find(section => section.sectionKey === sectionKey);
}