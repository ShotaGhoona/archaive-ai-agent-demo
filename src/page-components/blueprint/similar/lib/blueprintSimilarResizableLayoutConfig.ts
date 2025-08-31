import { ResizableLayoutConfig } from '@/shared';

// 図面類似ページ用設定（2パネル: 左: 図面ビューア、右: 類似図面ギャラリー）
export const blueprintSimilarResizableLayoutConfig: ResizableLayoutConfig = {
  direction: 'horizontal',
  panels: [
    { initialWidth: 70, minWidth: 50, maxWidth: 85 },
    { initialWidth: 30, minWidth: 15, maxWidth: 50 },
  ],
} as const;
