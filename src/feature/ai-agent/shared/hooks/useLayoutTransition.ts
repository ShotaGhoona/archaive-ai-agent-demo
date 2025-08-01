"use client";

import { useCallback, useRef } from "react";
import { ChatLayoutState, Position, Size } from "../../types/types";

export interface TransitionConfig {
  duration: number;
  easing: string;
  stagger?: number;
}

const DEFAULT_TRANSITION: TransitionConfig = {
  duration: 400,
  easing: "cubic-bezier(0.4, 0, 0.2, 1)"
};

export const useLayoutTransition = () => {
  const transitionRef = useRef<HTMLDivElement>(null);

  const getTransitionStyles = useCallback((
    fromState: ChatLayoutState,
    toState: ChatLayoutState,
    fromPosition: Position,
    fromSize: Size,
    toPosition: Position,
    toSize: Size
  ) => {
    const transitions: Record<string, unknown> = {
      [`${ChatLayoutState.FLOATING}-${ChatLayoutState.SIDEBAR}`]: {
        transform: [
          `translate(${fromPosition.x}px, ${fromPosition.y}px)`,
          `translate(${toPosition.x}px, ${toPosition.y}px)`
        ],
        width: [`${fromSize.width}px`, `${toSize.width}px`],
        height: [`${fromSize.height}px`, `${toSize.height}px`],
        borderRadius: ["12px", "0px"],
        phases: [
          { duration: 300, properties: ["transform"] },
          { duration: 200, delay: 100, properties: ["width", "height"] },
          { duration: 200, delay: 200, properties: ["borderRadius"] }
        ]
      },

      [`${ChatLayoutState.FLOATING}-${ChatLayoutState.FULLPAGE}`]: {
        transform: [
          `translate(${fromPosition.x}px, ${fromPosition.y}px) scale(1)`,
          `translate(calc(50vw - 50%), calc(50vh - 50%)) scale(1.05)`,
          `translate(calc(50vw - 50%), calc(50vh - 50%)) scale(1)`
        ],
        width: [`${fromSize.width}px`, `95vw`],
        height: [`${fromSize.height}px`, `95vh`],
        phases: [
          { duration: 200, properties: ["transform"] },
          { duration: 300, delay: 100, properties: ["width", "height"] },
          { duration: 100, delay: 300, properties: ["transform"] }
        ]
      },

      [`${ChatLayoutState.SIDEBAR}-${ChatLayoutState.FLOATING}`]: {
        transform: [
          `translate(${fromPosition.x}px, ${fromPosition.y}px)`,
          `translate(${toPosition.x}px, ${toPosition.y}px)`
        ],
        width: [`${fromSize.width}px`, `${toSize.width}px`],
        height: [`${fromSize.height}px`, `${toSize.height}px`],
        borderRadius: ["0px", "12px"],
        phases: [
          { duration: 200, properties: ["borderRadius"] },
          { duration: 200, delay: 100, properties: ["width", "height"] },
          { duration: 300, delay: 200, properties: ["transform"] }
        ]
      },

      [`${ChatLayoutState.SIDEBAR}-${ChatLayoutState.FULLPAGE}`]: {
        transform: [
          `translate(${fromPosition.x}px, ${fromPosition.y}px)`,
          `translate(calc(50vw - 50%), calc(50vh - 50%))`
        ],
        width: [`${fromSize.width}px`, `95vw`],
        height: [`${fromSize.height}px`, `95vh`],
        phases: [
          { duration: 300, properties: ["transform"] },
          { duration: 300, delay: 150, properties: ["width", "height"] }
        ]
      },

      [`${ChatLayoutState.FULLPAGE}-${ChatLayoutState.FLOATING}`]: {
        transform: [
          `translate(calc(50vw - 50%), calc(50vh - 50%)) scale(1)`,
          `translate(calc(50vw - 50%), calc(50vh - 50%)) scale(0.95)`,
          `translate(${toPosition.x}px, ${toPosition.y}px) scale(1)`
        ],
        width: [`95vw`, `${toSize.width}px`],
        height: [`95vh`, `${toSize.height}px`],
        borderRadius: ["0px", "12px"],
        phases: [
          { duration: 100, properties: ["transform"] },
          { duration: 300, delay: 100, properties: ["width", "height"] },
          { duration: 200, delay: 200, properties: ["transform", "borderRadius"] }
        ]
      },

      [`${ChatLayoutState.FULLPAGE}-${ChatLayoutState.SIDEBAR}`]: {
        transform: [
          `translate(calc(50vw - 50%), calc(50vh - 50%))`,
          `translate(${toPosition.x}px, ${toPosition.y}px)`
        ],
        width: [`95vw`, `${toSize.width}px`],
        height: [`95vh`, `${toSize.height}px`],
        phases: [
          { duration: 300, properties: ["width", "height"] },
          { duration: 300, delay: 150, properties: ["transform"] }
        ]
      }
    };

    return transitions[`${fromState}-${toState}`];
  }, []);

  const executeTransition = useCallback(async (
    element: HTMLElement,
    fromState: ChatLayoutState,
    toState: ChatLayoutState,
    fromPosition: Position,
    fromSize: Size,
    toPosition: Position,
    toSize: Size
  ): Promise<void> => {
    return new Promise((resolve) => {
      const transitionConfig = getTransitionStyles(
        fromState, toState, fromPosition, fromSize, toPosition, toSize
      );

      if (!transitionConfig) {
        resolve();
        return;
      }

      // Web Animations APIを使用してアニメーション実行
      const phases = (transitionConfig as { phases?: unknown[] }).phases;
      if (!phases || !Array.isArray(phases)) {
        resolve();
        return;
      }
      let totalDuration = 0;

      phases.forEach((phase: unknown) => {
        const phaseObj = phase as Record<string, unknown>;
        const delay = phaseObj.delay || 0;
        const phaseDuration = phaseObj.duration;
        
        setTimeout(() => {
          const keyframes: Record<string, unknown> = {};
          
          (phaseObj.properties as string[])?.forEach((prop: string) => {
            if ((transitionConfig as Record<string, unknown>)[prop]) {
              keyframes[prop] = (transitionConfig as Record<string, unknown>)[prop];
            }
          });

          element.animate(keyframes as unknown as Keyframe[], {
            duration: phaseDuration as number,
            easing: DEFAULT_TRANSITION.easing,
            fill: "forwards"
          });
        }, delay as number);

        totalDuration = Math.max(totalDuration, (delay as number) + (phaseDuration as number));
      });

      setTimeout(resolve, totalDuration);
    });
  }, [getTransitionStyles]);

  const calculateTargetPosition = useCallback((
    layoutState: ChatLayoutState,
    currentSize: Size
  ): Position => {
    switch (layoutState) {
      case ChatLayoutState.FLOATING:
        return { x: window.innerWidth - currentSize.width - 50, y: 50 };
      
      case ChatLayoutState.SIDEBAR:
        return { x: window.innerWidth - currentSize.width, y: 0 };
      
      case ChatLayoutState.FULLPAGE:
        return { 
          x: (window.innerWidth - currentSize.width) / 2, 
          y: (window.innerHeight - currentSize.height) / 2 
        };
      
      default:
        return { x: 50, y: 50 };
    }
  }, []);

  const calculateTargetSize = useCallback((
    layoutState: ChatLayoutState
  ): Size => {
    switch (layoutState) {
      case ChatLayoutState.FLOATING:
        return { width: 400, height: 700 };
      
      case ChatLayoutState.SIDEBAR:
        return { width: 400, height: window.innerHeight };
      
      case ChatLayoutState.FULLPAGE:
        return { 
          width: Math.min(window.innerWidth * 0.95, 1400), 
          height: Math.min(window.innerHeight * 0.95, 900) 
        };
      
      default:
        return { width: 400, height: 700 };
    }
  }, []);

  return {
    transitionRef,
    executeTransition,
    calculateTargetPosition,
    calculateTargetSize,
    getTransitionStyles
  };
};