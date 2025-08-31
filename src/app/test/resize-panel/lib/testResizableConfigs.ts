import { ResizableLayoutConfig } from '@/shared';

// 2パネル（従来）
export const twoColumnConfig: ResizableLayoutConfig = {
  direction: 'horizontal',
  panels: [
    { initialWidth: 60, minWidth: 20, maxWidth: 80 },
    { initialWidth: 40, minWidth: 20, maxWidth: 80 },
  ],
} as const;

// 3パネル
export const threeColumnConfig: ResizableLayoutConfig = {
  direction: 'horizontal',
  panels: [
    { initialWidth: 25, minWidth: 15, maxWidth: 40 },
    { initialWidth: 50, minWidth: 30, maxWidth: 70 },
    { initialWidth: 25, minWidth: 15, maxWidth: 40 },
  ],
} as const;

// 4パネル
export const fourColumnConfig: ResizableLayoutConfig = {
  direction: 'horizontal',
  panels: [
    { initialWidth: 25, minWidth: 10, maxWidth: 40 },
    { initialWidth: 25, minWidth: 10, maxWidth: 40 },
    { initialWidth: 25, minWidth: 10, maxWidth: 40 },
    { initialWidth: 25, minWidth: 10, maxWidth: 40 },
  ],
} as const;

// 垂直3パネル
export const threeRowConfig: ResizableLayoutConfig = {
  direction: 'vertical',
  panels: [
    { initialHeight: 30, minHeight: 20, maxHeight: 50 },
    { initialHeight: 40, minHeight: 30, maxHeight: 60 },
    { initialHeight: 30, minHeight: 20, maxHeight: 50 },
  ],
} as const;

// 5パネル（極端なテスト）
export const fiveColumnConfig: ResizableLayoutConfig = {
  direction: 'horizontal',
  panels: [
    { initialWidth: 20, minWidth: 10, maxWidth: 30 },
    { initialWidth: 20, minWidth: 10, maxWidth: 30 },
    { initialWidth: 20, minWidth: 10, maxWidth: 30 },
    { initialWidth: 20, minWidth: 10, maxWidth: 30 },
    { initialWidth: 20, minWidth: 10, maxWidth: 30 },
  ],
} as const;
