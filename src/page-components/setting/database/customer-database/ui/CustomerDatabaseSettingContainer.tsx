'use client';

import { DatabaseColumnSettingContainer } from '@/widgets';
import { CUSTOMER_COLUMN_SETTING_CONFIGS } from '../lib';

export function CustomerDatabaseSettingContainer() {
  return (
    <DatabaseColumnSettingContainer 
      defaultColumns={CUSTOMER_COLUMN_SETTING_CONFIGS}
      databaseType="customer"
      pageTitle="顧客データベース設定"
    />
  );
}