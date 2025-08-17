import { useState, useCallback } from 'react';

interface RotationConfig {
  step?: number;
}

interface RotationState {
  rotation: number;
}

interface RotationActions {
  rotateClockwise: () => void;
  rotateCounterClockwise: () => void;
  resetRotation: () => void;
  setRotation: (rotation: number) => void;
}

export function useRotation(
  config: RotationConfig = {},
  isLocked: boolean = false
): RotationState & RotationActions {
  const { step = 90 } = config;
  const [rotation, setRotationValue] = useState(0);

  const rotateClockwise = useCallback(() => {
    if (!isLocked) {
      setRotationValue(prev => (prev + step) % 360);
    }
  }, [isLocked, step]);

  const rotateCounterClockwise = useCallback(() => {
    if (!isLocked) {
      setRotationValue(prev => prev - step);
    }
  }, [isLocked, step]);

  const resetRotation = useCallback(() => {
    setRotationValue(0);
  }, []);

  const setRotation = useCallback((newRotation: number) => {
    if (!isLocked) {
      setRotationValue(newRotation);
    }
  }, [isLocked]);

  return {
    rotation,
    rotateClockwise,
    rotateCounterClockwise,
    resetRotation,
    setRotation
  };
}