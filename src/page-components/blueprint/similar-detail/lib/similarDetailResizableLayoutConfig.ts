import { ResizableLayoutConfig } from '@/shared';

export const similarDetailResizableLayoutConfig: ResizableLayoutConfig = {
  direction: 'horizontal',
  panels: [
    { initialWidth: 33, minWidth: 20, maxWidth: 50 }, // 対象図面パネル
    { initialWidth: 67, minWidth: 50, maxWidth: 80 }, // 類似図面ギャラリー
  ],
} as const;
