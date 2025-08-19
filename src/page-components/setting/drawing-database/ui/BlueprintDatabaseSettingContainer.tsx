'use client';

import { DatabaseColumnSettingContainer } from '@/widgets/database-column-setting';
import { BLUEPRINT_COLUMN_SETTING_CONFIGS } from '../lib/blueprintColumnSettingConfig';

export default function BlueprintDatabaseSettingContainer() {
  return (
    <DatabaseColumnSettingContainer 
      defaultColumns={BLUEPRINT_COLUMN_SETTING_CONFIGS}
      databaseType="blueprint"
      pageTitle="図面データベース設定"
    />
  );
}