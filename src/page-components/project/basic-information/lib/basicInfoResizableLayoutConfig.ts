import { ResizableLayoutConfig } from '@/shared';

export const basicInfoResizableLayoutConfig: ResizableLayoutConfig = {
  direction: 'horizontal',
  panels: [
    { initialWidth: 50, minWidth: 30, maxWidth: 70 }, // 左側 - 案件情報フォーム
    { initialWidth: 50, minWidth: 30, maxWidth: 70 }, // 右側 - 図面ギャラリー
  ],
} as const;
