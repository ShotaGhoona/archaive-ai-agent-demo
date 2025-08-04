"use client";

import { useCallback, useRef } from "react";
import { ChatLayoutState, Position, Size } from "../types/types";
import { FloatingLayoutRef } from "../shared/layouts/FloatingLayout";
import { SidebarLayoutRef } from "../shared/layouts/SidebarLayout";
import { FullpageLayoutRef } from "../shared/layouts/FullpageLayout";
import { DEFAULT_FLOATING_POSITION, DEFAULT_FLOATING_SIZE, DEFAULT_SIDEBAR_SIZE, DEFAULT_FULLPAGE_SIZE } from "../utils/constants";

interface UseLayoutManagerProps {
  layoutState: ChatLayoutState;
  updateLayoutState: (state: ChatLayoutState) => void;
  updatePosition: (position: Position) => void;
  updateSize: (size: Size) => void;
}

export const useLayoutManager = ({
  layoutState,
  updateLayoutState,
  updatePosition,
  updateSize
}: UseLayoutManagerProps) => {
  const floatingRef = useRef<FloatingLayoutRef>(null);
  const sidebarRef = useRef<SidebarLayoutRef>(null);
  const fullpageRef = useRef<FullpageLayoutRef>(null);

  const handleLayoutChange = useCallback(async (newLayout: ChatLayoutState) => {
    if (newLayout === layoutState) return;

    const currentRef = 
      layoutState === ChatLayoutState.FLOATING ? floatingRef.current :
      layoutState === ChatLayoutState.SIDEBAR ? sidebarRef.current :
      fullpageRef.current;

    const currentElement = currentRef?.getElement();
    if (!currentElement) return;

    // レイアウトに応じたデフォルト位置とサイズ
    const newPosition = newLayout === ChatLayoutState.FLOATING 
      ? DEFAULT_FLOATING_POSITION 
      : { x: 0, y: 0 };
    
    const newSize = newLayout === ChatLayoutState.FLOATING 
      ? DEFAULT_FLOATING_SIZE 
      : newLayout === ChatLayoutState.SIDEBAR 
        ? DEFAULT_SIDEBAR_SIZE 
        : DEFAULT_FULLPAGE_SIZE;

    // 即座に切り替え
    updateLayoutState(newLayout);
    updatePosition(newPosition);
    updateSize(newSize);
  }, [layoutState, updateLayoutState, updatePosition, updateSize]);

  return {
    floatingRef,
    sidebarRef,
    fullpageRef,
    handleLayoutChange
  };
};