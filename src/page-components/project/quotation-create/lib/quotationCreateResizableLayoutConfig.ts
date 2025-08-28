import { ResizableLayoutConfig } from "@/shared";

// 見積作成ページ用設定（左: フォーム, 右: プレビュー）
export const quotationCreateResizableLayoutConfig: ResizableLayoutConfig = {
  direction: 'horizontal',
  panels: [
    { initialWidth: 50, minWidth: 20, maxWidth: 80 },
    { initialWidth: 50, minWidth: 20, maxWidth: 80 }
  ]
} as const;