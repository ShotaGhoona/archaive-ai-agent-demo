'use client';
import { useState, useEffect, useCallback } from 'react';
import { PreviewableFile, PreviewOptions, PreviewProvider } from '../model';
import { PreviewProviderManager, defaultPreviewProviders } from '../lib';

interface UseFilePreviewProps {
  files: PreviewableFile[];
  initialIndex?: number;
  options?: PreviewOptions;
  providerManager?: PreviewProviderManager;
}

export function useFilePreview({
  files,
  initialIndex = 0,
  options = {},
  providerManager = new PreviewProviderManager(defaultPreviewProviders),
}: UseFilePreviewProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoom, setZoom] = useState(options.initialZoom || 1);
  const [rotation, setRotation] = useState(0);

  const currentFile = files[currentIndex];
  const isMultipleFiles = files.length > 1;

  // ファイルが変更された時にズームとローテーションをリセット
  useEffect(() => {
    if (currentIndex !== initialIndex) {
      setZoom(options.initialZoom || 1);
      setRotation(0);
    }
  }, [currentIndex, initialIndex, options.initialZoom]);

  // 初期インデックスが変更された時
  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  const handleZoomIn = useCallback(() => {
    const maxZoom = options.maxZoom || 5;
    setZoom((prev) => Math.min(prev * 1.2, maxZoom));
  }, [options.maxZoom]);

  const handleZoomOut = useCallback(() => {
    const minZoom = options.minZoom || 0.1;
    setZoom((prev) => Math.max(prev / 1.2, minZoom));
  }, [options.minZoom]);

  const handleRotate = useCallback(() => {
    setRotation((prev) => (prev + 90) % 360);
  }, []);

  const handleReset = useCallback(() => {
    setZoom(options.initialZoom || 1);
    setRotation(0);
  }, [options.initialZoom]);

  const handleNext = useCallback(() => {
    if (isMultipleFiles && currentIndex < files.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  }, [isMultipleFiles, currentIndex, files.length]);

  const handlePrevious = useCallback(() => {
    if (isMultipleFiles && currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  }, [isMultipleFiles, currentIndex]);

  const goToIndex = useCallback(
    (index: number) => {
      if (index >= 0 && index < files.length) {
        setCurrentIndex(index);
      }
    },
    [files.length],
  );

  const handleDownload = useCallback(() => {
    if (!currentFile) return;

    const link = document.createElement('a');
    link.href = currentFile.url;
    link.download = currentFile.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [currentFile]);

  const handleDownloadAll = useCallback(() => {
    files.forEach((file, index) => {
      setTimeout(() => {
        const link = document.createElement('a');
        link.href = file.url;
        link.download = file.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }, index * 100);
    });
  }, [files]);

  const getCurrentProvider = useCallback((): PreviewProvider | null => {
    if (!currentFile) return null;
    return providerManager.getProviderForFile(currentFile);
  }, [currentFile, providerManager]);

  const canZoomIn = zoom < (options.maxZoom || 5);
  const canZoomOut = zoom > (options.minZoom || 0.1);
  const canGoNext = isMultipleFiles && currentIndex < files.length - 1;
  const canGoPrevious = isMultipleFiles && currentIndex > 0;

  return {
    // 状態
    currentFile,
    currentIndex,
    zoom,
    rotation,
    isMultipleFiles,

    // アクション
    handleZoomIn,
    handleZoomOut,
    handleRotate,
    handleReset,
    handleNext,
    handlePrevious,
    goToIndex,
    handleDownload,
    handleDownloadAll,

    // フラグ
    canZoomIn,
    canZoomOut,
    canGoNext,
    canGoPrevious,

    // プロバイダー
    getCurrentProvider,

    // ヘルパー
    formatFileSize: (bytes: number) => {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },
  };
}
