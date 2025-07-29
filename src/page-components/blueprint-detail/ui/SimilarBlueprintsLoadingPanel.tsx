import React from "react";
import { Button } from "@/shared/shadcnui";
import { X, Search, Loader2 } from "lucide-react";

interface SimilarBlueprintsLoadingPanelProps {
  onClose: () => void;
}

export function SimilarBlueprintsLoadingPanel({ onClose }: SimilarBlueprintsLoadingPanelProps) {
  return (
    <div className="w-1/3 border-l bg-gray-50 flex flex-col">
      {/* ヘッダー */}
      <div className="flex items-center justify-between p-4 border-b bg-white">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">類似図面検索中</h3>
          <p className="text-sm text-gray-500">
            AI画像解析により類似図面を検索しています...
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onClose}
          className="h-8 w-8 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* ローディングエリア */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center space-y-6">
          {/* ローディングアニメーション */}
          <div className="relative">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <Search className="h-8 w-8 text-blue-600" />
            </div>
            <Loader2 className="absolute top-0 left-1/2 transform -translate-x-1/2 h-16 w-16 text-blue-500 animate-spin" />
          </div>
          
          {/* メッセージ */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-gray-700">
              類似図面を検索中
            </h3>
            <div className="space-y-2 text-sm text-gray-500">
              <p>• 画像の特徴を解析しています</p>
              <p>• データベースから類似図面を検索しています</p>
              <p>• 類似度を計算しています</p>
            </div>
          </div>

          {/* プログレスバー風の表示 */}
          <div className="w-full max-w-xs mx-auto">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full animate-pulse" style={{ width: '75%' }}></div>
            </div>
            <p className="text-xs text-gray-400 mt-2">処理中... しばらくお待ちください</p>
          </div>
        </div>
      </div>

      {/* フッター情報 */}
      <div className="border-t bg-white p-4">
        <div className="text-xs text-gray-500 text-center space-y-1">
          <p>検索には数秒かかる場合があります</p>
          <p className="text-gray-400">※実際の実装では、AI解析処理時間により変動します</p>
        </div>
      </div>
    </div>
  );
}