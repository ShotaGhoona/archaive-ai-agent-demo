import { LucideIcon } from 'lucide-react';
import { DatabaseColumnSettingConfig } from '@/widgets';

// 大項目カテゴリの定義
export interface DocumentCategory {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  documentTypes: DocumentType[];
}

// 帳票タイプの定義
export interface DocumentType {
  id: string;
  name: string;
  defaultColumns: DatabaseColumnSettingConfig[];
}
