import { ResizableLayoutConfig } from '@/shared';

// 図面基本情報ページ用設定（2パネル: 左: 図面ビューア、右: 基本情報フォーム）
export const blueprintBasicInformationResizableLayoutConfig: ResizableLayoutConfig =
  {
    direction: 'horizontal',
    panels: [
      { initialWidth: 70, minWidth: 50, maxWidth: 85 },
      { initialWidth: 30, minWidth: 15, maxWidth: 50 },
    ],
  } as const;
