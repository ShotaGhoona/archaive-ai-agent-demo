'use client';

import { DatabaseColumnSettingContainer } from '@/widgets/database-column-setting';
import { CUSTOMER_COLUMN_SETTING_CONFIGS } from '../lib/customerColumnSettingConfig';

export default function CustomerDatabaseSettingContainer() {
  return (
    <DatabaseColumnSettingContainer 
      defaultColumns={CUSTOMER_COLUMN_SETTING_CONFIGS}
      databaseType="customer"
      pageTitle="顧客データベース設定"
    />
  );
}