import { ResizableLayoutConfig } from '@/shared';

// BOMツリーと詳細パネルのレイアウト設定
export const bomResizableLayoutConfig: ResizableLayoutConfig = {
  direction: 'horizontal',
  panels: [
    { initialWidth: 20, minWidth: 15, maxWidth: 40 }, // 左サイドバー（BOMツリー）
    { initialWidth: 80, minWidth: 60, maxWidth: 85 }, // 右側詳細パネル
  ],
} as const;

// 詳細パネル内のメインコンテンツとメタデータのレイアウト設定
export const bomDetailResizableLayoutConfig: ResizableLayoutConfig = {
  direction: 'horizontal',
  panels: [
    { initialWidth: 70, minWidth: 50, maxWidth: 80 }, // メインコンテンツエリア
    { initialWidth: 30, minWidth: 20, maxWidth: 50 }, // メタデータパネル
  ],
} as const;
