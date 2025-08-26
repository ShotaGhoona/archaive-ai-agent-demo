"use client";

import React, { useState } from 'react';
import { Button } from '@/shared/shadcnui';
import { MessageCircle, Plus, X } from 'lucide-react';
import { cn } from '@/shared';
import { AIAgentConfig } from '../../types/types';
import AgentSelector from './AgentSelector';

// =============================================================================
// Types & Interfaces
// =============================================================================

interface ChatButtonProps {
  isOpen: boolean;
  availableAgents: AIAgentConfig[];
  onAgentSelect: (agentId: string) => void;
  onClose?: () => void;
  className?: string;
}


// =============================================================================
// Constants
// =============================================================================

const LAYOUT_CONFIG = {
  // メインチャットボタンの設定
  MAIN_BUTTON: {
    RIGHT_OFFSET: 24,    // 右端からの距離
    BOTTOM_OFFSET: 24,   // 下端からの距離
    SIZE: 56,            // ボタンサイズ
  }
} as const;

// =============================================================================
// Utility Functions
// =============================================================================


/**
 * メインボタンの状態に応じたアイコンを決定
 */
const getMainButtonIcon = (isOpen: boolean, agentCount: number) => {
  if (isOpen) return <X className="w-6 h-6" />;
  if (agentCount > 1) return <Plus className="w-6 h-6" />;
  return <MessageCircle className="w-6 h-6" />;
};

// =============================================================================
// Components
// =============================================================================


/**
 * メインチャットボタンコンポーネント
 */
const ChatButton: React.FC<ChatButtonProps> = ({
  isOpen,
  availableAgents,
  onAgentSelect,
  onClose,
  className
}) => {
  const [showAgents, setShowAgents] = useState(false);
  
  // ==========================================================================
  // Event Handlers
  // ==========================================================================
  
  const handleMainButtonClick = () => {
    if (isOpen) {
      onClose?.();
      return;
    }
    
    if (availableAgents.length === 0) {
      return; // エージェントがない場合は何もしない
    }
    
    if (availableAgents.length === 1) {
      onAgentSelect(availableAgents[0].id);
      return;
    }
    
    // 複数エージェントの場合は選択UIを表示
    setShowAgents(true);
  };
  
  const handleAgentSelect = (agentId: string) => {
    onAgentSelect(agentId);
    setShowAgents(false);
  };
  
  const handleSelectorClose = () => {
    setShowAgents(false);
  };
  
  // ==========================================================================
  // Render
  // ==========================================================================
  
  const { RIGHT_OFFSET, BOTTOM_OFFSET } = LAYOUT_CONFIG.MAIN_BUTTON;
  
  return (
    <>
      {/* メインチャットボタン - チャットが開いていない時のみ表示 */}
      {!isOpen && (
        <Button
          onClick={handleMainButtonClick}
          className={cn(
            // 基本スタイル
            "fixed w-14 h-14 rounded-full shadow-lg z-50",
            "bg-primary hover:bg-primary/90 text-primary-foreground",
            
            // アニメーション
            "transition-all duration-300",
            showAgents && "scale-110",
            
            // カスタムクラス
            className
          )}
          style={{
            right: RIGHT_OFFSET,
            bottom: BOTTOM_OFFSET
          }}
        >
          {getMainButtonIcon(isOpen, availableAgents.length)}
        </Button>
      )}

      {/* エージェント選択オーバーレイ */}
      <AgentSelector
        isOpen={showAgents && !isOpen}
        availableAgents={availableAgents}
        onAgentSelect={handleAgentSelect}
        onClose={handleSelectorClose}
      />
    </>
  );
};

export default ChatButton;