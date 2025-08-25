import { ResizableLayoutConfig } from "@/features";

// プロジェクト図面ページ用設定（左: サイドバー, 中央: ビューア、右: ユーティリティ）
export const projectBlueprintResizableLayoutConfig: ResizableLayoutConfig = {
  direction: 'horizontal',
  panels: [
    { initialWidth: 67, minWidth: 40, maxWidth: 80 },
    { initialWidth: 33, minWidth: 20, maxWidth: 60 }
  ]
} as const;