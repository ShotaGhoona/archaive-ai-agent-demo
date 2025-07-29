"use client";

import { Button } from "@/shared/shadcnui";
import { ChatLayoutState } from "../../types/types";
import { Zap, Sidebar, Maximize2, X } from "lucide-react";

interface ChatHeaderProps {
  currentLayout: ChatLayoutState;
  onLayoutChange: (layout: ChatLayoutState) => void;
  onClose: () => void;
  title?: string;
  onMouseDown?: (e: React.MouseEvent) => void;
  isDraggable?: boolean;
}

export default function ChatHeader({ 
  currentLayout, 
  onLayoutChange, 
  onClose, 
  title = "AI Assistant",
  onMouseDown,
  isDraggable = false 
}: ChatHeaderProps) {
  const layoutButtons = [
    {
      layout: ChatLayoutState.FLOATING,
      icon: Zap,
      label: "浮遊モード",
      tooltip: "自由な配置が可能な浮遊モード"
    },
    {
      layout: ChatLayoutState.SIDEBAR, 
      icon: Sidebar,
      label: "サイドバーモード",
      tooltip: "右側固定のサイドバーモード"
    },
    {
      layout: ChatLayoutState.FULLPAGE,
      icon: Maximize2,
      label: "フルページモード", 
      tooltip: "大画面での集中作業モード"
    }
  ];

  return (
    <div 
      className={`flex items-center justify-between p-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ${
        isDraggable ? 'cursor-move' : ''
      }`}
      onMouseDown={isDraggable ? onMouseDown : undefined}
    >
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
        <h3 className="font-medium text-foreground">{title}</h3>
      </div>
      
      <div className="flex items-center gap-1">
        {layoutButtons.map(({ layout, icon: Icon, label, tooltip }) => (
          <Button
            key={layout}
            variant={currentLayout === layout ? "default" : "ghost"}
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onLayoutChange(layout);
            }}
            title={tooltip}
            className="h-8 w-8 p-0"
          >
            <Icon className="h-4 w-4" />
            <span className="sr-only">{label}</span>
          </Button>
        ))}
        
        <div className="w-px h-4 bg-border mx-1"></div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">閉じる</span>
        </Button>
      </div>
    </div>
  );
}