import { CsvColumnConfig } from "@/shared";
import { Contact } from "../lib";

export const CONTACT_CSV_COLUMNS: Omit<CsvColumnConfig<Contact>, 'enabled'>[] = [
  { key: 'id', label: '担当者ID' },
  { key: 'customer_id', label: '顧客ID' },
  { key: 'name', label: '担当者名' },
  { key: 'phone_number', label: '電話番号' },
  { key: 'email', label: 'メールアドレス' },
  { key: 'created_at', label: '作成日' },
  { key: 'updated_at', label: '更新日' }
];