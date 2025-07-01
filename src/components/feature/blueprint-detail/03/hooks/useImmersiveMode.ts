"use client";

import { useState, useCallback, useEffect } from "react";
import { ImmersiveModeState } from "../types";

export const useImmersiveMode = () => {
  const [state, setState] = useState<ImmersiveModeState>({
    isActive: false,
    activeAnnotation: null,
    backgroundOpacity: 1,
    transitionState: 'idle'
  });

  const enterImmersiveMode = useCallback((annotationId: string) => {
    setState(prev => ({
      ...prev,
      transitionState: 'entering',
      activeAnnotation: annotationId
    }));

    // アニメーション
    setTimeout(() => {
      setState(prev => ({
        ...prev,
        isActive: true,
        backgroundOpacity: 0.3,
        transitionState: 'active'
      }));
    }, 100);
  }, []);

  const exitImmersiveMode = useCallback(() => {
    setState(prev => ({
      ...prev,
      transitionState: 'exiting'
    }));

    // アニメーション
    setTimeout(() => {
      setState(prev => ({
        ...prev,
        isActive: false,
        activeAnnotation: null,
        backgroundOpacity: 1,
        transitionState: 'idle'
      }));
    }, 300);
  }, []);

  // ESCキーで終了
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && state.isActive) {
        exitImmersiveMode();
      }
    };

    if (state.isActive) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [state.isActive, exitImmersiveMode]);

  return {
    ...state,
    enterImmersiveMode,
    exitImmersiveMode
  };
};