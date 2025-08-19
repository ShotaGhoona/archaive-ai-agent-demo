import { Button } from '@/shared/shadcnui';
import { Save } from 'lucide-react';
import { PreviewTable } from './PreviewTable';
import { PreviewFilter } from './PreviewFilter';
import { ColumnConfig } from '../model/types';

interface PageHeaderProps {
  onSave: () => void;
  columns: ColumnConfig[];
}

export function PageHeader({ onSave, columns }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between space-x-4">
      <div className="flex items-center space-x-2">
        <PreviewTable columns={columns} />
        <PreviewFilter columns={columns} />
      </div>
      
      <div className="flex items-center space-x-2">
        <Button onClick={onSave} size="lg" className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          設定を保存
        </Button>
      </div>
    </div>
  );
}