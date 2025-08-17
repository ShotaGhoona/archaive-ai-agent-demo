import { ResizableLayoutConfig } from "@/features/resizable-layout";

// 図面詳細ページ用設定（2パネル: 左: ビューア、右: 詳細パネル）
export const blueprintDetailConfig: ResizableLayoutConfig = {
  direction: 'horizontal',
  panels: [
    { initialWidth: 50, minWidth: 20, maxWidth: 80 },
    { initialWidth: 50, minWidth: 20, maxWidth: 80 }
  ]
} as const;