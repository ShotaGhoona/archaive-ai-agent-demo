import { Button } from '@/shared';
import { Save } from 'lucide-react';
import { PreviewTable, PreviewFilter } from '../ui';
import { ColumnConfig } from '../model';

interface PageHeaderProps {
  onSave: () => void;
  columns: ColumnConfig[];
}

export function PageHeader({ onSave, columns }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between space-x-4">
      <div className="flex items-center space-x-2">
      </div>
      
      <div className="flex items-center space-x-2">
        <PreviewTable columns={columns} />
        <PreviewFilter columns={columns} />
        <Button onClick={onSave} size="lg" className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          設定を保存
        </Button>
      </div>
    </div>
  );
}