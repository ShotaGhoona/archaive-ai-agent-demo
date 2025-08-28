import { CsvColumnConfig } from "@/shared";
import { Contact } from "../model";

export const CONTACT_CSV_COLUMNS: Omit<CsvColumnConfig<Contact>, 'enabled'>[] = [
  { key: 'contact_id', label: '連絡先ID' },
  { key: 'customer_id', label: '顧客ID' },
  { key: 'last_name', label: '姓' },
  { key: 'first_name', label: '名' },
  { key: 'last_name_kana', label: '姓（カナ）' },
  { key: 'first_name_kana', label: '名（カナ）' },
  { key: 'title', label: '役職' },
  { key: 'department', label: '部署名' },
  { key: 'email_primary', label: '主要メールアドレス' },
  { key: 'email_secondary', label: '副メールアドレス' },
  { key: 'phone_office', label: '会社電話番号' },
  { key: 'phone_mobile', label: '携帯電話番号' },
  { key: 'fax', label: 'FAX番号' },
  { key: 'owner_user_id', label: '担当営業' },
  { key: 'description', label: '連絡先概要' },
  { key: 'status', label: 'ステータス' },
  { key: 'created_date', label: '作成日時' },
  { key: 'created_by', label: '作成者' },
  { key: 'modified_date', label: '最終更新日時' },
  { key: 'modified_by', label: '最終更新者' }
];