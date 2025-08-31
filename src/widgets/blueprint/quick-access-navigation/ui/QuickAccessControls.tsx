'use client';
import { Button } from '@/shared';
import { History } from 'lucide-react';
import { QuickAccessControlsProps } from '../model';

export function QuickAccessControls({
  showRevision,
  onToggleRevision,
}: QuickAccessControlsProps) {
  return (
    <div className='flex items-center gap-3'>
      <Button
        variant={showRevision ? 'default' : 'outline'}
        size='lg'
        onClick={onToggleRevision}
        className='transition-all duration-200'
      >
        <History className='mr-2 h-4 w-4' />
        {showRevision ? '閉じる' : 'リビジョン図面を見る'}
      </Button>
    </div>
  );
}
