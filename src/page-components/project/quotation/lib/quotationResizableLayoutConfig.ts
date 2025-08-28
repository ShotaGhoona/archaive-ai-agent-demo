import { ResizableLayoutConfig } from "@/shared";

// 見積書ページ用設定（中央: プレビュー, 右: 情報パネル）
export const quotationResizableLayoutConfig: ResizableLayoutConfig = {
  direction: 'horizontal',
  panels: [
    { initialWidth: 70, minWidth: 40, maxWidth: 85 }, // 中央プレビュー
    { initialWidth: 30, minWidth: 15, maxWidth: 60 }  // 右情報パネル
  ]
} as const;