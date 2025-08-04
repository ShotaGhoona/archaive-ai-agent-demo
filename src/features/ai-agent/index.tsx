"use client";

import { useCallback, useRef, useEffect, useState } from "react";
import { ChatLayoutState, Message, ChatUIManagerProps, AIAgentConfig } from "./types/types";
import { useChatUIState } from "./shared/hooks/useChatUIState";
import { getAgentConfigs, getAgentConfig } from "./utils/agentConfigs";
import { sendUnifiedMessage } from "./utils/chatApi";
import ChatButton from "./shared/components/ChatButton";
import FloatingLayout, { FloatingLayoutRef } from "./shared/layouts/FloatingLayout";
import SidebarLayout, { SidebarLayoutRef } from "./shared/layouts/SidebarLayout";
import FullpageLayout, { FullpageLayoutRef } from "./shared/layouts/FullpageLayout";


export default function ChatUIManager({ availableAgents }: ChatUIManagerProps) {
  const { state, actions } = useChatUIState('default');
  
  const floatingRef = useRef<FloatingLayoutRef>(null);
  const sidebarRef = useRef<SidebarLayoutRef>(null);
  const fullpageRef = useRef<FullpageLayoutRef>(null);
  
  // 一時的な添付ファイル（プレビュー表示用）
  const [attachedFile, setAttachedFile] = useState<File | null>(null);

  // propsから渡されたエージェント設定を反映
  useEffect(() => {
    const agentConfigs = getAgentConfigs(availableAgents);
    actions.updateAvailableAgents(agentConfigs);
  }, [availableAgents]);



  const handleLayoutChange = useCallback(async (newLayout: ChatLayoutState) => {
    if (newLayout === state.layoutState) return;

    const currentRef = 
      state.layoutState === ChatLayoutState.FLOATING ? floatingRef.current :
      state.layoutState === ChatLayoutState.SIDEBAR ? sidebarRef.current :
      fullpageRef.current;

    const currentElement = currentRef?.getElement();
    if (!currentElement) return;

    // レイアウトに応じたデフォルト位置とサイズ
    const newPosition = newLayout === ChatLayoutState.FLOATING ? { x: 50, y: 50 } : { x: 0, y: 0 };
    const newSize = newLayout === ChatLayoutState.FLOATING ? { width: 400, height: 700 } : 
                    newLayout === ChatLayoutState.SIDEBAR ? { width: 384, height: window.innerHeight } :
                    { width: window.innerWidth * 0.8, height: window.innerHeight * 0.8 };

    // 即座に切り替え
    actions.updateLayoutState(newLayout);
    actions.updatePosition(newPosition);
    actions.updateSize(newSize);
  }, [state, actions.updateLayoutState, actions.updatePosition, actions.updateSize]);

  const handleAgentSelect = useCallback((agentId: string) => {
    const agentConfig = getAgentConfig(agentId);
    if (agentConfig) {
      actions.selectAgent(agentId, agentConfig);
    }
  }, [actions.selectAgent]);


  const handleSendMessage = useCallback(async (content: string) => {
    if (!state.agentConfig || !state.selectedAgent) return;

    const hasImage = !!attachedFile;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content: hasImage ? `${content} [画像参照]` : content,
      sender: 'user',
      timestamp: new Date(),
    };

    actions.addMessage(userMessage);
    
    // カコトラAI（trouble）の場合は、フロントエンドで処理を完結
    if (state.selectedAgent === 'trouble') {
      // ChatContentコンポーネントが検索処理を行うため、
      // ここではメッセージの追加のみ行う
      actions.setLoading(false);
      return;
    }
    
    // その他のエージェントは通常通りAPIを呼ぶ
    actions.setLoading(true);

    const typingMessage: Message = {
      id: 'typing',
      content: '',
      sender: 'ai',
      timestamp: new Date(),
      isTyping: true,
    };
    actions.addMessage(typingMessage);

    try {
      // ダミーAPIを呼び出し
      const response = await sendUnifiedMessage(
        state.selectedAgent,
        content,
        {
          image: attachedFile || undefined
        }
      );

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: response.response,
        sender: 'ai',
        timestamp: new Date(),
      };

      actions.removeMessage('typing');
      actions.addMessage(aiResponse);
      actions.setLoading(false);
      
      // 送信後に添付ファイルをクリア
      setAttachedFile(null);
    } catch (error) {
      console.error('Failed to send message:', error);
      
      // エラー時はフォールバック応答を使用
      const fallbackResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: error instanceof Error 
          ? `申し訳ございません。エラーが発生しました: ${error.message}`
          : 'エラーが発生しました。しばらくしてからもう一度お試しください。',
        sender: 'ai',
        timestamp: new Date(),
      };

      actions.removeMessage('typing');
      actions.addMessage(fallbackResponse);
      actions.setLoading(false);
    }
  }, [actions.addMessage, actions.setLoading, actions.removeMessage, state.agentConfig, state.selectedAgent, state.messages, attachedFile]);

  const handleQuickAction = useCallback((action: string) => {
    handleSendMessage(action);
  }, [handleSendMessage]);

  // ファイル添付ハンドラー（送信はしない）
  const handleFileAttach = useCallback((file: File) => {
    setAttachedFile(file);
  }, []);

  // 一時添付ファイル削除ハンドラー
  const handleRemoveAttachment = useCallback(() => {
    setAttachedFile(null);
  }, []);


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
              blueprintInfo={undefined}
              {...commonProps}
            />
          )}
        </>
      )}
    </>
  );
}