"use client";
import { useState, useCallback, useEffect } from "react";

interface Position {
  x: number;
  y: number;
}

interface UsePicturePreviewProps {
  imageUrl?: string;
}

export function usePicturePreview({ imageUrl }: UsePicturePreviewProps) {
  // Zoom state
  const [zoom, setZoom] = useState(1);
  const [isZoomLocked, setIsZoomLocked] = useState(false);
  
  // Drag state
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<Position>({ x: 0, y: 0 });
  
  // Rotation state
  const [rotation, setRotation] = useState(0);

  // Reset all when activeFile changes
  useEffect(() => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
    setRotation(0);
    setIsDragging(false);
  }, [imageUrl]);

  // Zoom functions
  const zoomIn = useCallback(() => {
    if (!isZoomLocked) {
      setZoom(prev => Math.min(prev * 1.2, 5));
    }
  }, [isZoomLocked]);

  const zoomOut = useCallback(() => {
    if (!isZoomLocked) {
      setZoom(prev => Math.max(prev / 1.2, 0.1));
    }
  }, [isZoomLocked]);

  const fitToScreen = useCallback(() => {
    if (!isZoomLocked) {
      setZoom(1);
      setPosition({ x: 0, y: 0 });
    }
  }, [isZoomLocked]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (!isZoomLocked) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      setZoom(prev => Math.max(0.1, Math.min(5, prev * delta)));
    }
  }, [isZoomLocked]);

  const toggleZoomLock = useCallback(() => {
    setIsZoomLocked(prev => !prev);
  }, []);

  // Drag functions
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  }, [position]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Rotation functions
  const rotateClockwise = useCallback(() => {
    if (!isZoomLocked) {
      setRotation(prev => prev + 90);
    }
  }, [isZoomLocked]);

  const rotateCounterClockwise = useCallback(() => {
    if (!isZoomLocked) {
      setRotation(prev => prev - 90);
    }
  }, [isZoomLocked]);

  return {
    // State
    zoom,
    isZoomLocked,
    position,
    isDragging,
    rotation,
    // Zoom actions
    zoomIn,
    zoomOut,
    fitToScreen,
    handleWheel,
    toggleZoomLock,
    // Drag actions
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    // Rotation actions
    rotateClockwise,
    rotateCounterClockwise,
  };
}