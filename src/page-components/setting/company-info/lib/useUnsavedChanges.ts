'use client';

import { useState, useEffect } from 'react';

interface UseUnsavedChangesProps {
  hasChanges: boolean;
  onShowDialog: () => void;
  onHideDialog: () => void;
}

export function useUnsavedChanges({ hasChanges, onShowDialog, onHideDialog }: UseUnsavedChangesProps) {
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);

  // ブラウザの beforeunload イベントで未保存の変更を警告
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasChanges]);

  // Next.js Router内のリンククリックをインターセプト
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!hasChanges) return;

      const target = e.target as HTMLElement;
      const link = target.closest('a');
      
      if (link && link.href && link.href !== window.location.href) {
        e.preventDefault();
        e.stopPropagation();
        setPendingNavigation(link.href);
        onShowDialog();
      }
    };

    // 全てのリンククリックをキャプチャ
    document.addEventListener('click', handleClick, true);
    
    return () => {
      document.removeEventListener('click', handleClick, true);
    };
  }, [hasChanges, onShowDialog]);

  const executeNavigation = () => {
    if (pendingNavigation) {
      window.location.href = pendingNavigation;
      setPendingNavigation(null);
    }
    onHideDialog();
  };

  const cancelNavigation = () => {
    setPendingNavigation(null);
    onHideDialog();
  };

  return {
    executeNavigation,
    cancelNavigation,
    hasPendingNavigation: !!pendingNavigation,
  };
}