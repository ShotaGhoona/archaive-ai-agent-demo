import { Button } from '@/shared';
import { Save } from 'lucide-react';

interface PageHeaderProps {
  onSave: () => void;
}

export function PageHeader({ onSave }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between space-x-4">
      <div className="flex items-center space-x-2">
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