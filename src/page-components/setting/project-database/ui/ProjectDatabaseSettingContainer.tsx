'use client';

import { DatabaseColumnSettingContainer } from '@/widgets/database-column-setting';
import { PROJECT_COLUMN_SETTING_CONFIGS } from '../lib/projectColumnSettingConfig';

export default function ProjectDatabaseSettingContainer() {
  return (
    <DatabaseColumnSettingContainer 
      defaultColumns={PROJECT_COLUMN_SETTING_CONFIGS}
      databaseType="project"
      pageTitle="案件データベース設定"
    />
  );
}