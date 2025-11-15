import { ResizableLayoutConfig } from '@/shared';

export const similarDetailResizableLayoutConfig: ResizableLayoutConfig = {
  direction: 'horizontal',
  panels: [
    { initialWidth: 50, minWidth: 20, maxWidth: 50 }, // 対象図面パネル
    { initialWidth: 50, minWidth: 50, maxWidth: 80 }, // 類似図面ギャラリー
  ],
} as const;
