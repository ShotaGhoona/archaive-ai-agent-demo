import { useState, useCallback } from 'react';

interface ZoomConfig {
  minZoom?: number;
  maxZoom?: number;
  zoomStep?: number;
  wheelZoomStep?: number;
}

interface ZoomState {
  zoom: number;
  isZoomLocked: boolean;
}

interface ZoomActions {
  zoomIn: () => void;
  zoomOut: () => void;
  fitToScreen: () => void;
  handleWheel: (e: React.WheelEvent) => void;
  toggleZoomLock: () => void;
  resetZoom: () => void;
  setZoom: (zoom: number) => void;
}

export function useZoom(config: ZoomConfig = {}): ZoomState & ZoomActions {
  const {
    minZoom = 0.1,
    maxZoom = 5,
    zoomStep = 1.2,
    wheelZoomStep = 0.1
  } = config;

  const [zoom, setZoomValue] = useState(1);
  const [isZoomLocked, setIsZoomLocked] = useState(false);

  const setZoom = useCallback((newZoom: number) => {
    if (!isZoomLocked) {
      setZoomValue(Math.max(minZoom, Math.min(maxZoom, newZoom)));
    }
  }, [isZoomLocked, minZoom, maxZoom]);

  const zoomIn = useCallback(() => {
    if (!isZoomLocked) {
      setZoomValue(prev => Math.min(prev * zoomStep, maxZoom));
    }
  }, [isZoomLocked, zoomStep, maxZoom]);

  const zoomOut = useCallback(() => {
    if (!isZoomLocked) {
      setZoomValue(prev => Math.max(prev / zoomStep, minZoom));
    }
  }, [isZoomLocked, zoomStep, minZoom]);

  const fitToScreen = useCallback(() => {
    if (!isZoomLocked) {
      setZoomValue(1);
    }
  }, [isZoomLocked]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (!isZoomLocked) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? (1 - wheelZoomStep) : (1 + wheelZoomStep);
      setZoomValue(prev => Math.max(minZoom, Math.min(maxZoom, prev * delta)));
    }
  }, [isZoomLocked, wheelZoomStep, minZoom, maxZoom]);

  const toggleZoomLock = useCallback(() => {
    setIsZoomLocked(prev => !prev);
  }, []);

  const resetZoom = useCallback(() => {
    setZoomValue(1);
  }, []);

  return {
    zoom,
    isZoomLocked,
    zoomIn,
    zoomOut,
    fitToScreen,
    handleWheel,
    toggleZoomLock,
    resetZoom,
    setZoom
  };
}