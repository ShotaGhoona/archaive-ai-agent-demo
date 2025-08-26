import { CsvColumnConfig } from '@/shared';
import { MaterialMaster } from '../lib';

export const MATERIAL_MASTER_CSV_COLUMNS: Omit<CsvColumnConfig<MaterialMaster>, 'enabled'>[] = [
  { key: 'id', label: 'ID' },
  { key: 'materialName', label: '材料名' },
  { key: 'materialCategory', label: '材料カテゴリ' },
  { key: 'formula', label: '計算式' },
  { key: 'supplier', label: '仕入れ先' },
  { key: 'remarks', label: '備考' },
  { 
    key: 'updatedAt', 
    label: '更新日時',
    formatter: (value: unknown) => new Date(String(value)).toLocaleString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  },
];