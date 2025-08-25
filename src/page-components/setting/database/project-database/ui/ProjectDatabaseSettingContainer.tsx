'use client';

import { DatabaseColumnSettingContainer } from '@/widgets';
import { PROJECT_COLUMN_SETTING_CONFIGS } from '../lib';

export function ProjectDatabaseSettingContainer() {
  return (
    <DatabaseColumnSettingContainer 
      defaultColumns={PROJECT_COLUMN_SETTING_CONFIGS}
      databaseType="project"
      pageTitle="案件データベース設定"
    />
  );
}