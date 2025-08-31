import { CsvColumnConfig } from '@/shared';
import { DrawingPageBaseDataInterface } from '@/dummy-data-er-fix/blueprint';

export const BLUEPRINT_CSV_COLUMNS: Omit<
  CsvColumnConfig<DrawingPageBaseDataInterface>,
  'enabled'
>[] = [
  { key: 'id', label: 'ID' },
  { key: 'ulid', label: 'ULID' },
  { key: 'drawing_file_id', label: '図面ファイルID' },
  { key: 'drawing_number', label: '図面番号' },
  { key: 'external_drawing_number', label: '外部図面番号' },
  { key: 'drawing_category_rename_id', label: '図面カテゴリリネームID' },
  { key: 'page_number', label: 'ページ番号' },
  { key: 'is_shown_similar_search', label: '類似検索表示' },
  { key: 's3_url', label: 'S3 URL' },
  { key: 'remarks', label: '備考' },
  { key: 'created_by', label: '作成者ID' },
  { key: 'updated_by', label: '更新者ID' },
  { key: 'created_at', label: '作成日時' },
  { key: 'updated_at', label: '更新日時' },
  { key: 'drawing_file_name', label: 'ファイル名' },
  { key: 'drawing_file_extension', label: 'ファイル拡張子' },
  { key: 'leaf_product_id', label: '製品ID' },
  { key: 'leaf_product_name', label: '製品名' },
  { key: 'leaf_product_revision_number', label: '製品リビジョン番号' },
  { key: 'customer_id', label: '顧客ID' },
  { key: 'customer_name', label: '顧客名' },
  { key: 'company_id', label: '会社ID' },
  { key: 'company_name', label: '会社名' },
  { key: 'drawing_category_name', label: '図面カテゴリ' },
  { key: 'created_by_name', label: '作成者名' },
  { key: 'updated_by_name', label: '更新者名' },
];
