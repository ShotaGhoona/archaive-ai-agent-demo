"use client";

import { useRef, useCallback } from "react";
import { AnnotationPoint as AnnotationPointType } from "./types";
import AnnotationPoint from "./AnnotationPoint";

interface InteractiveCanvasProps {
  imageUrl: string;
  imageName: string;
  annotations: AnnotationPointType[];
  onAnnotationClick: (annotation: AnnotationPointType) => void;
  onCanvasClick: (position: { x: number; y: number }, relativePosition: { x: number; y: number }) => void;
  activeAnnotationId?: string | null;
  backgroundOpacity: number;
}

export default function InteractiveCanvas({
  imageUrl,
  imageName,
  annotations,
  onAnnotationClick,
  onCanvasClick,
  activeAnnotationId,
  backgroundOpacity
}: InteractiveCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (!canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // 相対座標（0-1）に変換
    const relativeX = x / rect.width;
    const relativeY = y / rect.height;

    // 既存の注釈ポイントをクリックしていないかチェック
    const clickedAnnotation = annotations.find(annotation => {
      const distance = Math.sqrt(
        Math.pow(annotation.screenPosition.x - x, 2) +
        Math.pow(annotation.screenPosition.y - y, 2)
      );
      return distance < 20; // 20px以内
    });

    if (!clickedAnnotation) {
      onCanvasClick({ x, y }, { x: relativeX, y: relativeY });
    }
  }, [annotations, onCanvasClick]);

  // 相対座標から画面座標に変換
  const updateScreenPositions = useCallback(() => {
    if (!canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    
    annotations.forEach(annotation => {
      annotation.screenPosition = {
        x: annotation.position.x * rect.width,
        y: annotation.position.y * rect.height
      };
    });
  }, [annotations]);

  // リサイズ時に座標を更新
  const handleResize = useCallback(() => {
    updateScreenPositions();
  }, [updateScreenPositions]);

  return (
    <div 
      ref={canvasRef}
      className="relative w-full h-full bg-gray-50 rounded-lg overflow-hidden cursor-crosshair"
      onClick={handleCanvasClick}
      onLoad={updateScreenPositions}
      onResize={handleResize}
    >
      {/* 図面画像 */}
      <img
        src={imageUrl}
        alt={imageName}
        className="w-full h-full object-contain transition-opacity duration-500"
        style={{ opacity: backgroundOpacity }}
        onLoad={updateScreenPositions}
      />

      {/* 注釈ポイント群 */}
      {annotations.map((annotation) => (
        <AnnotationPoint
          key={annotation.id}
          annotation={annotation}
          onClick={() => onAnnotationClick(annotation)}
          isActive={activeAnnotationId === annotation.id}
        />
      ))}

      {/* ヒント表示（注釈がない場合） */}
      {annotations.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-background/90 backdrop-blur-sm border border-border rounded-lg p-6 shadow-lg">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📍</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">図面上をクリックしてください</h3>
              <p className="text-muted-foreground max-w-sm">
                図面の任意の箇所をクリックすると、その部分について詳しく質問できる注釈ポイントが作成されます。
              </p>
            </div>
          </div>
        </div>
      )}

      {/* グリッド表示（デバッグ用） */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute inset-0 pointer-events-none opacity-10">
          <svg className="w-full h-full">
            <defs>
              <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="gray" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
      )}
    </div>
  );
}