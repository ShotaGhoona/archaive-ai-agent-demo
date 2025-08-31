import { ResizableLayoutConfig } from '@/shared';

// 図面見積ページ用設定（2パネル: 左: 図面ビューア、右: 見積計算フォーム）
export const blueprintEstimateResizableLayoutConfig: ResizableLayoutConfig = {
  direction: 'horizontal',
  panels: [
    { initialWidth: 70, minWidth: 50, maxWidth: 85 },
    { initialWidth: 30, minWidth: 15, maxWidth: 50 },
  ],
} as const;
