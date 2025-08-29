import { ResizableLayoutConfig } from "@/shared";

// 納品書ページ用設定（中央: プレビュー, 右: 情報パネル）
export const deliveryResizableLayoutConfig: ResizableLayoutConfig = {
  direction: 'horizontal',
  panels: [
    { initialWidth: 70, minWidth: 40, maxWidth: 85 }, // 中央プレビュー
    { initialWidth: 30, minWidth: 15, maxWidth: 60 }  // 右情報パネル
  ]
} as const;