import { CsvColumnConfig } from '@/shared';
import { CustomerContactDataInterface } from '@/dummy-data-er-fix/customer';

export const CONTACT_CSV_COLUMNS: Omit<CsvColumnConfig<CustomerContactDataInterface>, 'enabled'>[] =
  [
    { key: 'id', label: '連絡先ID' },
    { key: 'customer_id', label: '顧客ID' },
    { key: 'last_name', label: '姓' },
    { key: 'first_name', label: '名' },
    { key: 'last_name_kana', label: '姓（カナ）' },
    { key: 'first_name_kana', label: '名（カナ）' },
    { key: 'customer_contact_custom_items.役職.value', label: '役職' },
    { key: 'customer_contact_custom_items.部署.value', label: '部署名' },
    { key: 'email_primary', label: '主要メールアドレス' },
    { key: 'email_secondary', label: '副メールアドレス' },
    { key: 'office_phone_number', label: '会社電話番号' },
    { key: 'phone_number', label: '携帯電話番号' },
    { key: 'fax', label: 'FAX番号' },
    { key: 'customer_contact_custom_items.営業メモ.value', label: '営業メモ' },
    { key: 'remarks', label: '備考' },
    { key: 'is_active', label: 'ステータス' },
    { key: 'created_at', label: '作成日時' },
    { key: 'updated_at', label: '最終更新日時' },
  ];
