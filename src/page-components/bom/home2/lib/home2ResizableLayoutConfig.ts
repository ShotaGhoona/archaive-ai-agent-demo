import { ResizableLayoutConfig } from '@/shared';

export const home2ResizableLayoutConfig: ResizableLayoutConfig = {
  direction: 'horizontal',
  panels: [
    { initialWidth: 50, minWidth: 30, maxWidth: 70 }, // BOMツリー
    { initialWidth: 50, minWidth: 30, maxWidth: 70 }, // 詳細パネル
  ],
} as const;
