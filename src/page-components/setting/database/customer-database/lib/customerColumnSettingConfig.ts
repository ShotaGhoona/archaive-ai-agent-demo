import { DatabaseColumnSettingConfig } from '@/widgets';

// 全てのテーブルに共通の項目
export const COMMON_COLUMNS: DatabaseColumnSettingConfig[] = [
  {
    id: 'created_date',
    name: '作成日時',
    description: 'レコード作成日時',
    dataType: 'date',
    editable: false,
  },
  {
    id: 'created_user_id',
    name: '作成者',
    description: 'レコード作成者',
    dataType: 'user',
    editable: false,
  },
  {
    id: 'modified_date',
    name: '最終更新日時',
    description: '最終更新日時',
    dataType: 'date',
    editable: false,
  },
  {
    id: 'modified_user_id',
    name: '最終更新者',
    description: '最終更新ユーザー',
    dataType: 'user',
    editable: false,
  },
];

// 取引先テーブルのカラム設定
const ACCOUNT_COLUMNS: DatabaseColumnSettingConfig[] = [
  {
    id: 'account_id',
    name: '取引先ID（主キー）',
    description: 'システムとしての管理IDとして使用',
    dataType: 'text',
    editable: false,
  },
  {
    id: 'business_account_id',
    name: '取引先ID(業務)',
    description: '業務で使用する取引先ID',
    dataType: 'text',
  },
  {
    id: 'account_name',
    name: '取引先名',
    description: '取引先の正式名称',
    dataType: 'text',
  },
  {
    id: 'account_name_kana',
    name: '取引先名（カナ）',
    description: '取引先名のカナ読み',
    dataType: 'text',
  },
  {
    id: 'account_type',
    name: '取引先種別',
    description: '取引先の種別',
    dataType: 'text',
  },
  {
    id: 'status',
    name: 'ステータス',
    description: '取引先の状態',
    dataType: 'text',
  },
  {
    id: 'annual_revenue',
    name: '年間売上高',
    description: '年間の売上高',
    dataType: 'number',
  },
  {
    id: 'employee_count',
    name: '従業員数',
    description: '従業員の数',
    dataType: 'number',
  },
  {
    id: 'website',
    name: 'Webサイト',
    description: '会社のWebサイトURL',
    dataType: 'text',
  },
  {
    id: 'description',
    name: '取引先概要',
    description: '取引先についての詳細情報',
    dataType: 'text',
  },
  {
    id: 'parent_account_id',
    name: '親会社ID',
    description: '親会社がある場合のID',
    dataType: 'text',
  },
  {
    id: 'owner_user_id',
    name: '担当営業ID',
    description: '担当営業のユーザーID',
    dataType: 'user',
  },
  ...COMMON_COLUMNS,
];

// 連絡先テーブルのカラム設定
const CONTACT_COLUMNS: DatabaseColumnSettingConfig[] = [
  {
    id: 'contact_id',
    name: '連絡先ID（主キー）',
    description: '連絡先の一意識別子',
    dataType: 'text',
    editable: false,
  },
  {
    id: 'account_id',
    name: '所属取引先ID',
    description: '所属する取引先のID',
    dataType: 'text',
    editable: false,
  },
  {
    id: 'last_name',
    name: '姓',
    description: '連絡先担当者の姓',
    dataType: 'text',
  },
  {
    id: 'first_name',
    name: '名',
    description: '連絡先担当者の名',
    dataType: 'text',
  },
  {
    id: 'last_name_kana',
    name: '姓（カナ）',
    description: '連絡先担当者の姓（カナ）',
    dataType: 'text',
  },
  {
    id: 'first_name_kana',
    name: '名（カナ）',
    description: '連絡先担当者の名（カナ）',
    dataType: 'text',
  },
  {
    id: 'title',
    name: '役職',
    description: '連絡先担当者の役職',
    dataType: 'text',
  },
  {
    id: 'department',
    name: '部署名',
    description: '所属部署名',
    dataType: 'text',
  },
  {
    id: 'email_primary',
    name: '主要メールアドレス',
    description: 'メインのメールアドレス',
    dataType: 'text',
  },
  {
    id: 'email_secondary',
    name: '副メールアドレス',
    description: 'サブのメールアドレス',
    dataType: 'text',
  },
  {
    id: 'phone_office',
    name: '会社電話番号',
    description: '会社の電話番号',
    dataType: 'text',
  },
  {
    id: 'phone_mobile',
    name: '携帯電話番号',
    description: '携帯電話番号',
    dataType: 'text',
  },
  {
    id: 'fax',
    name: 'FAX番号',
    description: 'FAX番号',
    dataType: 'text',
  },
  {
    id: 'owner_user_id',
    name: '担当営業ID',
    description: '担当営業のユーザーID',
    dataType: 'user',
  },
  {
    id: 'contact_description',
    name: '連絡先概要',
    description: '連絡先についての詳細情報',
    dataType: 'text',
  },
  {
    id: 'status',
    name: 'ステータス',
    description: '有効/無効',
    dataType: 'boolean',
  },
  ...COMMON_COLUMNS,
];

// デフォルトのテーブル定義
export const DEFAULT_CUSTOMER_TABLES = [
  {
    id: 'account',
    name: '取引先',
    defaultColumns: ACCOUNT_COLUMNS,
  },
  {
    id: 'contact',
    name: '連絡先',
    defaultColumns: CONTACT_COLUMNS,
  },
];