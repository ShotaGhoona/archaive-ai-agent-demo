"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/shared/shadcnui';
import { cn } from '@/shared';
import { AIAgentConfig } from '../../types/types';

// =============================================================================
// Types & Interfaces
// =============================================================================

export interface AgentSelectorProps {
  isOpen: boolean;
  availableAgents: AIAgentConfig[];
  onAgentSelect: (agentId: string) => void;
  onClose: () => void;
}

interface AgentButtonProps {
  agent: AIAgentConfig;
  position: { x: number; y: number };
  index: number;
  onClick: () => void;
}

interface Position {
  x: number;
  y: number;
}

// =============================================================================
// Constants
// =============================================================================

const LAYOUT_CONFIG = {
  // エージェントボタンの設定
  AGENT_BUTTON: {
    RADIUS: 80,          // メインボタンからの距離
    SIZE: 48,            // エージェントボタンのサイズ
    HALF_SIZE: 24,       // ボタンサイズの半分（センタリング用）
  },
  
  // 角度設定（時計の9時から12時方向の扇形）
  ANGLE: {
    START_DEG: 180,      // 9時方向（左）
    END_DEG: 90,         // 12時方向（上）
    get RANGE_DEG() {
      return this.START_DEG - this.END_DEG; // 90度の範囲
    }
  },
  
  // アニメーション設定
  ANIMATION: {
    STAGGER_DELAY: 100,  // エージェントボタンの段階的表示遅延（ms）
  }
} as const;

// =============================================================================
// Utility Functions
// =============================================================================

/**
 * エージェントの数に応じて配置角度を計算
 */
const calculateAgentAngle = (index: number, totalAgents: number): number => {
  const { START_DEG, RANGE_DEG } = LAYOUT_CONFIG.ANGLE;
  
  if (totalAgents === 1) {
    // 1つの場合は中央（10時30分方向）
    return START_DEG - (RANGE_DEG / 2);
  }
  
  // 複数の場合は等間隔配置
  return START_DEG - (RANGE_DEG * index / (totalAgents - 1));
};

/**
 * メインボタンの中心座標を計算
 */
const getMainButtonCenter = (): Position => {
  const RIGHT_OFFSET = 24;
  const BOTTOM_OFFSET = 24;
  const MAIN_BUTTON_SIZE = 56;
  
  return {
    x: window.innerWidth - RIGHT_OFFSET - (MAIN_BUTTON_SIZE / 2),
    y: window.innerHeight - BOTTOM_OFFSET - (MAIN_BUTTON_SIZE / 2)
  };
};

/**
 * エージェントボタンの位置を計算（扇形配置）
 */
const calculateAgentPosition = (index: number, totalAgents: number): Position => {
  const angleDeg = calculateAgentAngle(index, totalAgents);
  const angleRad = (angleDeg * Math.PI) / 180;
  const mainButtonCenter = getMainButtonCenter();
  const { RADIUS } = LAYOUT_CONFIG.AGENT_BUTTON;
  
  return {
    x: mainButtonCenter.x + Math.cos(angleRad) * RADIUS,
    y: mainButtonCenter.y - Math.sin(angleRad) * RADIUS // Y軸は上が負
  };
};

// =============================================================================
// Components
// =============================================================================

/**
 * エージェント選択ボタンコンポーネント
 */
const AgentButton: React.FC<AgentButtonProps> = ({
  agent,
  position,
  index,
  onClick
}) => {
  const [isVisible, setIsVisible] = useState(false);
  
  // 段階的アニメーション
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, index * LAYOUT_CONFIG.ANIMATION.STAGGER_DELAY);
    
    return () => clearTimeout(timer);
  }, [index]);
  
  const { HALF_SIZE } = LAYOUT_CONFIG.AGENT_BUTTON;
  
  return (
    <div
      className={cn(
        "fixed transition-all duration-300 ease-out",
        isVisible ? "opacity-100 scale-100" : "opacity-0 scale-75"
      )}
      style={{
        left: position.x - HALF_SIZE,
        top: position.y - HALF_SIZE,
        zIndex: 45
      }}
    >
      <div className="relative group">
        <Button
          onClick={onClick}
          className={cn(
            "w-12 h-12 rounded-full shadow-lg",
            "hover:scale-110 transition-transform duration-200",
            "text-white border-2 border-white/20"
          )}
          style={{ backgroundColor: agent.color }}
          title={`${agent.name}: ${agent.description}`}
        >
          <agent.icon className="w-5 h-5" />
        </Button>
        
        {/* ホバー時のラベル */}
        <div className="absolute right-12 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="text-xs font-medium text-white bg-black/80 px-2 py-1 rounded whitespace-nowrap">
            {agent.name}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * エージェント選択オーバーレイコンポーネント
 */
const AgentSelector: React.FC<AgentSelectorProps> = ({
  isOpen,
  availableAgents,
  onAgentSelect,
  onClose
}) => {
  const handleAgentSelect = (agentId: string) => {
    onAgentSelect(agentId);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-40"
      onClick={onClose}
    >
      {/* エージェントボタン群 */}
      {availableAgents.map((agent, index) => {
        const position = calculateAgentPosition(index, availableAgents.length);
        
        return (
          <AgentButton
            key={agent.id}
            agent={agent}
            position={position}
            index={index}
            onClick={() => handleAgentSelect(agent.id)}
          />
        );
      })}
    </div>
  );
};

export default AgentSelector;