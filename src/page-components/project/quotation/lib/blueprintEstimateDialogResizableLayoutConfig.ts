import { ResizableLayoutConfig } from "@/features";

// 図面見積もりダイアログ用設定（左: 将来拡張用, 右: 見積もり画面）
export const blueprintEstimateDialogResizableLayoutConfig: ResizableLayoutConfig = {
  direction: 'horizontal',
  panels: [
    { initialWidth: 60, minWidth: 20, maxWidth: 80 },
    { initialWidth: 40, minWidth: 20, maxWidth: 80 }
  ]
} as const;