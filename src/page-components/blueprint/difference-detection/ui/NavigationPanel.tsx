"use client";
import { useRef } from "react";

interface NavigationPanelProps {
  imageUrl: string;
  currentZoom: number;
  currentPosition: { x: number; y: number };
  containerSize: { width: number; height: number };
  imageSize: { width: number; height: number };
}

export function NavigationPanel({
  imageUrl,
  currentZoom,
  currentPosition,
  containerSize,
  imageSize
}: NavigationPanelProps) {
  const overviewRef = useRef<HTMLDivElement>(null);

  // オーバービューのサイズを計算
  const overviewSize = 280; // 固定サイズ（拡大）
  // 画像サイズが有効でない場合はコンポーネントをレンダリングしない
  const hasValidImageSize = imageSize.width > 0 && imageSize.height > 0;
  
  // 有効なサイズがない場合は早期リターン
  if (!hasValidImageSize) {
    return (
      <div className="space-y-3">
        <div 
          className="relative bg-gray-100 rounded-lg border border-gray-300 overflow-hidden mx-auto flex items-center justify-center"
          style={{ 
            width: `${overviewSize * 0.8}px`, 
            height: `${overviewSize * 0.6}px` 
          }}
        >
          <div className="text-center text-gray-400">
            <div className="text-2xl mb-1">📐</div>
            <div className="text-xs">読み込み中...</div>
          </div>
        </div>
        <div className="text-xs text-gray-500 text-center">
          ズーム: {Math.round(currentZoom * 100)}%
        </div>
      </div>
    );
  }

  const aspectRatio = imageSize.width / imageSize.height;
  const overviewWidth = aspectRatio > 1 ? overviewSize : overviewSize * aspectRatio;
  const overviewHeight = aspectRatio > 1 ? overviewSize / aspectRatio : overviewSize;

  // 現在のビューポートをオーバービューに投影
  const getViewportRect = () => {
    if (!containerSize.width || !containerSize.height || !imageSize.width || !imageSize.height) {
      return { x: 0, y: 0, width: 0, height: 0 };
    }

    // スケール比率
    const scaleX = overviewWidth / imageSize.width;
    const scaleY = overviewHeight / imageSize.height;

    // ビューポートサイズ（画像座標系）
    const viewportWidth = containerSize.width / currentZoom;
    const viewportHeight = containerSize.height / currentZoom;

    // ビューポート中心位置（画像座標系）
    const viewportCenterX = imageSize.width / 2 - currentPosition.x / currentZoom;
    const viewportCenterY = imageSize.height / 2 - currentPosition.y / currentZoom;

    // オーバービューでのビューポート矩形（中心基準）
    const centerX = viewportCenterX * scaleX;
    const centerY = viewportCenterY * scaleY;
    const width = viewportWidth * scaleX;
    const height = viewportHeight * scaleY;

    return {
      x: centerX - width / 2,
      y: centerY - height / 2,
      width,
      height
    };
  };

  const viewportRect = getViewportRect();

  // インタラクション機能は削除（読み取り専用）

  return (
    <div className="space-y-3">
      <div 
        ref={overviewRef}
        className="relative bg-gray-100 rounded-lg border border-gray-300 overflow-hidden mx-auto"
        style={{ 
          width: `${overviewWidth}px`, 
          height: `${overviewHeight}px` 
        }}
      >
        {/* オーバービュー画像 */}
        <img
          src={imageUrl}
          alt="オーバービュー"
          className="w-full h-full object-cover"
          draggable={false}
        />
        
        {/* 現在のビューポート表示（ズームイン時のみ） */}
        {currentZoom > 1 && (
          <div
            className="absolute border-2 border-secondary bg-secondary/20"
            style={{
              left: `${viewportRect.x}px`,
              top: `${viewportRect.y}px`,
              width: `${viewportRect.width}px`,
              height: `${viewportRect.height}px`,
              clipPath: `inset(${Math.max(0, -viewportRect.y)}px ${Math.max(0, viewportRect.x + viewportRect.width - overviewWidth)}px ${Math.max(0, viewportRect.y + viewportRect.height - overviewHeight)}px ${Math.max(0, -viewportRect.x)}px)`
            }}
          />
        )}
        
        {/* ズームアウト時は全体枠を表示 */}
        {currentZoom <= 1 && (
          <div
            className="absolute border-2 border-secondary bg-secondary/10"
            style={{
              left: '0px',
              top: '0px',
              width: `${overviewWidth}px`,
              height: `${overviewHeight}px`,
            }}
          />
        )}
      </div>

      {/* ズーム情報 */}
      <div className="text-xs text-gray-500 text-center">
        ズーム: {Math.round(currentZoom * 100)}%
      </div>
    </div>
  );
}