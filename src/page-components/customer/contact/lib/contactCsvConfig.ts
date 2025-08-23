import { CsvColumnConfig } from "@/features";
import { Contact } from "../lib";

export const CONTACT_CSV_COLUMNS: Omit<CsvColumnConfig<Contact>, 'enabled'>[] = [
  { key: 'contactId', label: '連絡先ID' },
  { key: 'contactName', label: '氏名' },
  { key: 'department', label: '部門' },
  { key: 'position', label: '役職' },
  { key: 'contactType', label: 'タイプ' },
  { key: 'phoneNumber', label: '電話番号' },
  { key: 'mobileNumber', label: '携帯電話' },
  { key: 'email', label: 'メールアドレス' },
  { key: 'notes', label: '備考' },
  { key: 'isActive', label: 'ステータス' },
  { key: 'createdAt', label: '作成日' },
  { key: 'updatedAt', label: '更新日' }
];