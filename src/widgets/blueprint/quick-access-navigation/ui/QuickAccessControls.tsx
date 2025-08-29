'use client';
import { Button } from '@/shared';
import { Layers3, History } from 'lucide-react';
import { QuickAccessControlsProps } from '../model';

export function QuickAccessControls({ 
  showSameProject, 
  showRevision, 
  onToggleSameProject, 
  onToggleRevision 
}: QuickAccessControlsProps) {
  return (
    <div className="flex items-center gap-3">
      <Button 
        variant={showSameProject ? "default" : "outline"} 
        size="lg" 
        onClick={onToggleSameProject}
        className="transition-all duration-200"
      >
        <Layers3 className="h-4 w-4 mr-2" />
        {showSameProject ? '閉じる' : '同一案件の図面を見る'}
      </Button>
      <Button 
        variant={showRevision ? "default" : "outline"} 
        size="lg" 
        onClick={onToggleRevision}
        className="transition-all duration-200"
      >
        <History className="h-4 w-4 mr-2" />
        {showRevision ? '閉じる' : 'リビジョン図面を見る'}
      </Button>
    </div>
  );
}