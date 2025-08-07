"use client";
import { useState, useEffect } from "react";
import mockData from "../data/mockData.json";

interface Difference {
  id: string;
  coordinates: {
    topLeft: { x: number; y: number };
    bottomRight: { x: number; y: number };
  };
}

type ToleranceLevel = "1px" | "5px" | "10px" | "15px";

interface DifferenceGalleryProps {
  tolerance?: ToleranceLevel;
  onDifferenceClick?: (difference: Difference) => void;
}

export function DifferenceGallery({ tolerance = "1px", onDifferenceClick }: DifferenceGalleryProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [differences, setDifferences] = useState<Difference[]>([]);
  const baseImageUrl = mockData.differenceDetection.difference.imageUrl;

  // 許容誤差変更時のローディング処理
  useEffect(() => {
    setIsLoading(true);
    
    // リアルなローディング時間をシミュレート
    const loadingTime = Math.random() * 1000 + 500; // 500ms～1.5s
    
    const timer = setTimeout(() => {
      const newDifferences = (mockData.differencesByTolerance[tolerance] || []) as Difference[];
      setDifferences(newDifferences);
      setIsLoading(false);
    }, loadingTime);

    return () => clearTimeout(timer);
  }, [tolerance]);

  // 初期ローディング
  useEffect(() => {
    const timer = setTimeout(() => {
      const initialDifferences = (mockData.differencesByTolerance[tolerance] || []) as Difference[];
      setDifferences(initialDifferences);
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const handleDifferenceClick = (difference: Difference) => {
    onDifferenceClick?.(difference);
  };

  // 座標（%指定）から切り取り範囲を計算してサムネイル生成
  const getThumbnailStyle = (difference: Difference) => {
    const { topLeft, bottomRight } = difference.coordinates;
    
    // 切り取り範囲のサイズを計算（%指定）
    const cropWidth = bottomRight.x - topLeft.x;
    const cropHeight = bottomRight.y - topLeft.y;
    
    // パーセンテージで切り取り位置とサイズを計算
    const left = topLeft.x * 100;
    const top = topLeft.y * 100;
    
    return {
      backgroundImage: `url(${baseImageUrl})`,
      backgroundPosition: `${left}% ${top}%`,
      backgroundSize: `${(1 / cropWidth) * 100}% ${(1 / cropHeight) * 100}%`,
      backgroundRepeat: 'no-repeat'
    };
  };

  // ローディング状態のUI
  if (isLoading) {
    return (
      <div className="overflow-y-auto">
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          </div>
          <div className="text-center space-y-2">
            <p className="text-sm font-medium text-gray-700">差分を解析中...</p>
            <p className="text-xs text-gray-500">許容誤差: {tolerance}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <div className="text-lg font-bold">差分情報</div>
        <div className="text-xs text-gray-600">
          検出された差分: <span className="font-semibold text-primary">{differences.length}件</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {differences.map((difference, index) => {
          
          return (
            <div
              key={difference.id}
              onClick={() => handleDifferenceClick(difference)}
              className="relative bg-gray-100 rounded-lg border border-gray-300 cursor-pointer hover:shadow-md transition-shadow group overflow-hidden aspect-video"
            >
              {/* 切り取りサムネイル */}
              <div
                className="w-full h-full group-hover:scale-105 transition-transform duration-200"
                style={getThumbnailStyle(difference)}
              />
              
              {/* 差分番号バッジ */}
              <div className="absolute top-1 right-1 bg-secondary text-secondary-foreground text-xs font-medium px-1.5 py-0.5 rounded">
                {index + 1}
              </div>
              
              {/* ホバー時のオーバーレイ */}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                <div className="text-white text-xs font-medium">
                  クリックでズーム
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}