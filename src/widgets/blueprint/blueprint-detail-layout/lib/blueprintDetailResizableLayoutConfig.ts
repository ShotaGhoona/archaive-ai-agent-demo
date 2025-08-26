import { ResizableLayoutConfig } from "@/shared";

// 図面詳細ページ用設定（2パネル: 左: ビューア、右: 詳細パネル）
export const blueprintDetailResizableLayoutConfig: ResizableLayoutConfig = {
  direction: 'horizontal',
  panels: [
    { initialWidth: 70, minWidth: 20, maxWidth: 80 },
    { initialWidth: 30, minWidth: 20, maxWidth: 80 }
  ]
} as const;