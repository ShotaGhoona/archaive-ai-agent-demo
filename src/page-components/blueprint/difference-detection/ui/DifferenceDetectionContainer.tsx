'use client';
import { useState } from 'react';
import { BlueprintCompareViewer } from '../ui';
import { NavigationPanel } from '../ui';
import { DifferenceGallery } from '../ui';
import { differenceDetectionData } from '../data';

type ToleranceLevel = '1px' | '5px' | '10px' | '15px';

interface Difference {
  id: string;
  coordinates: {
    topLeft: { x: number; y: number };
    bottomRight: { x: number; y: number };
  };
}

export function DifferenceDetectionContainer() {
  const [tolerance, setTolerance] = useState<ToleranceLevel>('1px');
  const [viewerState, setViewerState] = useState({
    zoom: 1,
    position: { x: 0, y: 0 },
    containerSize: { width: 0, height: 0 },
    imageSize: { width: 0, height: 0 },
    currentImageUrl:
      differenceDetectionData.differenceDetection.difference.imageUrl,
  });

  const handleViewerStateChange = (
    zoom: number,
    position: { x: number; y: number },
    containerSize: { width: number; height: number },
    imageSize: { width: number; height: number },
    imageUrl: string,
  ) => {
    setViewerState({
      zoom,
      position,
      containerSize,
      imageSize,
      currentImageUrl: imageUrl,
    });
  };

  const handleDifferenceClick = (difference: Difference) => {
    // 差分の座標中心を計算
    const centerX =
      (difference.coordinates.topLeft.x +
        difference.coordinates.bottomRight.x) /
      2;
    const centerY =
      (difference.coordinates.topLeft.y +
        difference.coordinates.bottomRight.y) /
      2;

    // ズームレベルを設定（差分がよく見えるように）
    const targetZoom = 3;

    // コンテナサイズから位置を計算
    const { containerSize } = viewerState;
    if (containerSize.width > 0 && containerSize.height > 0) {
      // 中心座標を実際の画像座標に変換（%から実座標へ）
      const imageWidth = viewerState.imageSize.width || 1200;
      const imageHeight = viewerState.imageSize.height || 800;

      const imageCenterX = centerX * imageWidth;
      const imageCenterY = centerY * imageHeight;

      // Viewerの中心に差分が来るように位置を計算
      const newPosition = {
        x: containerSize.width / 2 - imageCenterX * targetZoom,
        y: containerSize.height / 2 - imageCenterY * targetZoom,
      };

      // Viewerの状態を更新
      setViewerState((prev) => ({
        ...prev,
        zoom: targetZoom,
        position: newPosition,
      }));
    }

    console.log(
      '差分クリック:',
      difference,
      `中心座標: (${centerX}, ${centerY})`,
    );
  };

  const handleToleranceChange = (newTolerance: ToleranceLevel) => {
    setTolerance(newTolerance);
  };

  return (
    <div className='flex h-[calc(100vh-45px)] overflow-hidden'>
      {/* 左側: BlueprintCompareViewer */}
      <div className='flex-1'>
        <BlueprintCompareViewer
          onStateChange={handleViewerStateChange}
          externalZoom={viewerState.zoom}
          externalPosition={viewerState.position}
          onToleranceChange={handleToleranceChange}
        />
      </div>

      {/* 右側: 現在地パネル + 差分情報 */}
      <div className='flex w-120 flex-col border-l'>
        {/* 上部: 現在地パネル */}
        <div className='border-b bg-white p-4'>
          <NavigationPanel
            imageUrl={viewerState.currentImageUrl}
            currentZoom={viewerState.zoom}
            currentPosition={viewerState.position}
            containerSize={viewerState.containerSize}
            imageSize={viewerState.imageSize}
          />
        </div>

        {/* 下部: 差分情報ギャラリー */}
        <div className='flex-1 bg-white p-4'>
          <DifferenceGallery
            tolerance={tolerance}
            onDifferenceClick={handleDifferenceClick}
          />
        </div>
      </div>
    </div>
  );
}
