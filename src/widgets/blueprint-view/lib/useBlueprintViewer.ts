import { useEffect, useCallback } from 'react';
import { useZoom } from './useZoom';
import { useDragPan } from './useDragPan';
import { useRotation } from './useRotation';
import { useFileOperations } from './useFileOperations';

interface BlueprintViewerConfig {
  zoom?: {
    minZoom?: number;
    maxZoom?: number;
    zoomStep?: number;
    wheelZoomStep?: number;
  };
  rotation?: {
    step?: number;
  };
  fileOperations?: {
    onDownloadStart?: () => void;
    onDownloadComplete?: () => void;
    onPrintStart?: () => void;
    onPrintComplete?: () => void;
  };
}

export function useBlueprintViewer(
  activeFileId?: string,
  config: BlueprintViewerConfig = {}
) {
  const zoomControls = useZoom(config.zoom);
  const dragControls = useDragPan();
  const rotationControls = useRotation(config.rotation, zoomControls.isZoomLocked);
  const fileOperations = useFileOperations(config.fileOperations);

  const resetAll = useCallback(() => {
    zoomControls.resetZoom();
    dragControls.resetPosition();
    rotationControls.resetRotation();
  }, [zoomControls.resetZoom, dragControls.resetPosition, rotationControls.resetRotation]);

  const handleFitToScreen = useCallback(() => {
    zoomControls.fitToScreen();
    dragControls.resetPosition();
  }, [zoomControls.fitToScreen, dragControls.resetPosition]);

  useEffect(() => {
    resetAll();
  }, [activeFileId, resetAll]);

  return {
    // Zoom controls
    zoom: zoomControls.zoom,
    isZoomLocked: zoomControls.isZoomLocked,
    zoomIn: zoomControls.zoomIn,
    zoomOut: zoomControls.zoomOut,
    fitToScreen: handleFitToScreen,
    handleWheel: zoomControls.handleWheel,
    toggleZoomLock: zoomControls.toggleZoomLock,
    
    // Drag controls
    position: dragControls.position,
    isDragging: dragControls.isDragging,
    handleMouseDown: dragControls.handleMouseDown,
    handleMouseMove: dragControls.handleMouseMove,
    handleMouseUp: dragControls.handleMouseUp,
    
    // Rotation controls
    rotation: rotationControls.rotation,
    rotateClockwise: rotationControls.rotateClockwise,
    rotateCounterClockwise: rotationControls.rotateCounterClockwise,
    
    // File operations
    downloadFile: fileOperations.downloadFile,
    printFile: fileOperations.printFile,
    
    // Utility
    resetAll
  };
}