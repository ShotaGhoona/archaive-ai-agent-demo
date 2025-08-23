'use client';

import { DatabaseColumnSettingContainer } from '@/widgets';
import { BLUEPRINT_COLUMN_SETTING_CONFIGS } from '../lib';

export function BlueprintDatabaseSettingContainer() {
  return (
    <DatabaseColumnSettingContainer 
      defaultColumns={BLUEPRINT_COLUMN_SETTING_CONFIGS}
      databaseType="blueprint"
      pageTitle="図面データベース設定"
    />
  );
}