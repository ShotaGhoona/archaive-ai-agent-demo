"use client";

import { forwardRef, useRef, useImperativeHandle } from "react";
import { Card } from "@/components/ui/card";
import { ChatLayoutState, Position, Size, Message } from "../../types/types";
import ChatHeader from "../components/ChatHeader";
import ChatContent from "../components/ChatContent";
import ChatInput from "../components/ChatInput";

interface FloatingLayoutProps {
  position: Position;
  size: Size;
  messages: Message[];
  isLoading: boolean;
  onLayoutChange: (layout: ChatLayoutState) => void;
  onClose: () => void;
  onSendMessage: (message: string) => void;
  onQuickAction: (action: string) => void;
  onPositionChange: (position: Position) => void;
  onSizeChange: (size: Size) => void;
  isDraggable?: boolean;
  isResizable?: boolean;
  selectedAgent?: string | null;
  agentConfig?: any;
  agentContent?: React.ReactNode;
  agentInput?: React.ReactNode;
}

export interface FloatingLayoutRef {
  getElement: () => HTMLDivElement | null;
}

const FloatingLayout = forwardRef<FloatingLayoutRef, FloatingLayoutProps>(({
  position,
  size,
  messages,
  isLoading,
  onLayoutChange,
  onClose,
  onSendMessage,
  onQuickAction,
  onPositionChange,
  onSizeChange,
  isDraggable = true,
  isResizable = true,
  selectedAgent,
  agentConfig,
  agentContent,
  agentInput
}, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ isDragging: boolean; startPos: Position; startMousePos: Position }>({
    isDragging: false,
    startPos: { x: 0, y: 0 },
    startMousePos: { x: 0, y: 0 }
  });
  const resizeRef = useRef<{ isResizing: boolean; startSize: Size; startMousePos: Position }>({
    isResizing: false,
    startSize: { width: 0, height: 0 },
    startMousePos: { x: 0, y: 0 }
  });

  useImperativeHandle(ref, () => ({
    getElement: () => containerRef.current
  }));

  // ドラッグ機能
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isDraggable) return;
    
    dragRef.current = {
      isDragging: true,
      startPos: position,
      startMousePos: { x: e.clientX, y: e.clientY }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!dragRef.current.isDragging) return;

      const deltaX = e.clientX - dragRef.current.startMousePos.x;
      const deltaY = e.clientY - dragRef.current.startMousePos.y;

      const newX = Math.max(0, Math.min(
        window.innerWidth - size.width,
        dragRef.current.startPos.x + deltaX
      ));
      const newY = Math.max(0, Math.min(
        window.innerHeight - size.height,
        dragRef.current.startPos.y + deltaY
      ));

      onPositionChange({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      dragRef.current.isDragging = false;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // リサイズ機能
  const handleResizeMouseDown = (e: React.MouseEvent) => {
    if (!isResizable) return;
    e.stopPropagation();

    resizeRef.current = {
      isResizing: true,
      startSize: size,
      startMousePos: { x: e.clientX, y: e.clientY }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!resizeRef.current.isResizing) return;

      const deltaX = e.clientX - resizeRef.current.startMousePos.x;
      const deltaY = e.clientY - resizeRef.current.startMousePos.y;

      const newWidth = Math.max(300, Math.min(
        window.innerWidth - position.x,
        resizeRef.current.startSize.width + deltaX
      ));
      const newHeight = Math.max(400, Math.min(
        window.innerHeight - position.y,
        resizeRef.current.startSize.height + deltaY
      ));

      onSizeChange({ width: newWidth, height: newHeight });
    };

    const handleMouseUp = () => {
      resizeRef.current.isResizing = false;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <Card
      ref={containerRef}
      className="fixed py-0 z-40 shadow-2xl border-border/50 backdrop-blur-sm bg-background/95 supports-[backdrop-filter]:bg-background/90 overflow-hidden"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: `${size.height}px`
      }}
    >
      <div className="flex flex-col h-full">
        <ChatHeader
          currentLayout={ChatLayoutState.FLOATING}
          onLayoutChange={onLayoutChange}
          onClose={onClose}
          onMouseDown={handleMouseDown}
          isDraggable={isDraggable}
          title={agentConfig?.name ? `${agentConfig.name} Assistant` : "AI Assistant"}
        />
        
        <div className="flex-1 overflow-hidden">
          {agentContent || (
            <ChatContent
              messages={messages}
              isLoading={isLoading}
            />
          )}
        </div>
        
        {agentInput || (
          <ChatInput
            onSendMessage={onSendMessage}
            onQuickAction={onQuickAction}
            disabled={isLoading}
          />
        )}
      </div>

      {/* リサイズハンドル */}
      {isResizable && (
        <div
          className="absolute bottom-0 right-0 w-4 h-4 cursor-nw-resize opacity-50 hover:opacity-100 transition-opacity"
          onMouseDown={handleResizeMouseDown}
        >
          <div className="absolute bottom-1 right-1 w-2 h-2 border-r-2 border-b-2 border-muted-foreground/50"></div>
        </div>
      )}
    </Card>
  );
});

FloatingLayout.displayName = "FloatingLayout";

export default FloatingLayout;