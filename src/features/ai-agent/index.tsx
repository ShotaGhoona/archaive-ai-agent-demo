"use client";

import { useCallback, useEffect } from "react";
import { ChatLayoutState, ChatUIManagerProps } from "./types/types";
import { useChatUIState } from "./shared/hooks/useChatUIState";
import { useChatManager } from "./hooks/useChatManager";
import { useLayoutManager } from "./hooks/useLayoutManager";
import { getAgentConfigs, getAgentConfig } from "./utils/agentConfigs";
import ChatButton from "./shared/components/ChatButton";
import FloatingLayout from "./shared/layouts/FloatingLayout";
import SidebarLayout from "./shared/layouts/SidebarLayout";
import FullpageLayout from "./shared/layouts/FullpageLayout";

export default function ChatUIManager({ availableAgents }: ChatUIManagerProps) {
  const { state, actions } = useChatUIState();
  
  // レイアウト管理
  const { floatingRef, sidebarRef, fullpageRef, handleLayoutChange } = useLayoutManager({
    layoutState: state.layoutState,
    updateLayoutState: actions.updateLayoutState,
    updatePosition: actions.updatePosition,
    updateSize: actions.updateSize
  });

  // チャット管理
  const { 
    handleSendMessage, 
    handleQuickAction
  } = useChatManager({
    selectedAgent: state.selectedAgent,
    agentConfig: state.agentConfig,
    addMessage: actions.addMessage,
    removeMessage: actions.removeMessage,
    setLoading: actions.setLoading
  });

  // propsから渡されたエージェント設定を反映
  useEffect(() => {
    const agentConfigs = getAgentConfigs(availableAgents);
    actions.updateAvailableAgents(agentConfigs);
  }, [availableAgents, actions]);

  // エージェント選択ハンドラー
  const handleAgentSelect = useCallback((agentId: string) => {
    const agentConfig = getAgentConfig(agentId);
    if (agentConfig) {
      actions.selectAgent(agentId, agentConfig);
    }
  }, [actions]);

  // 共通プロパティ
  const commonProps = {
    messages: state.messages,
    isLoading: state.isLoading,
    onLayoutChange: handleLayoutChange,
    onClose: actions.closeChat,
    onSendMessage: handleSendMessage,
    onQuickAction: handleQuickAction,
    selectedAgent: state.selectedAgent,
    agentConfig: state.agentConfig
  };

  return (
    <>
      {/* チャットボタン */}
      <ChatButton
        isOpen={state.isOpen}
        availableAgents={state.availableAgents}
        onAgentSelect={handleAgentSelect}
        onClose={actions.closeChat}
      />

      {/* レイアウト別レンダリング */}
      {state.isOpen && state.agentConfig && (
        <>
          {state.layoutState === ChatLayoutState.FLOATING && (
            <FloatingLayout
              ref={floatingRef}
              position={state.position}
              size={state.size}
              onPositionChange={actions.updatePosition}
              onSizeChange={actions.updateSize}
              {...commonProps}
            />
          )}

          {state.layoutState === ChatLayoutState.SIDEBAR && (
            <SidebarLayout
              ref={sidebarRef}
              {...commonProps}
            />
          )}

          {state.layoutState === ChatLayoutState.FULLPAGE && (
            <FullpageLayout
              ref={fullpageRef}
              {...commonProps}
            />
          )}
        </>
      )}
    </>
  );
}