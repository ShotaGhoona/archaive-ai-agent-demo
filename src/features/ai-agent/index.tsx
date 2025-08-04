"use client";

import { useCallback, useRef, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ChatLayoutState, Message, BlueprintInfo, ChatUIManagerProps, AIAgentConfig } from "./types/types";
import { useChatUIState } from "./shared/hooks/useChatUIState";
import { useLayoutTransition } from "./shared/hooks/useLayoutTransition";
import { getAgentConfigs, getAgentConfig } from "./utils/agentConfigs";
import { sendUnifiedMessage, convertMessagesToHistory } from "./utils/chatApi";
import ChatButton from "./shared/components/ChatButton";
import FloatingLayout, { FloatingLayoutRef } from "./shared/layouts/FloatingLayout";
import SidebarLayout, { SidebarLayoutRef } from "./shared/layouts/SidebarLayout";
import FullpageLayout, { FullpageLayoutRef } from "./shared/layouts/FullpageLayout";
import blueprintsData from "@/page-components/blueprint/data/blueprint.json";


export default function ChatUIManager({ availableAgents }: ChatUIManagerProps) {
  const params = useParams();
  const blueprintId = params.id as string;
  const blueprint = blueprintsData.find((item) => item.internalNumber === blueprintId);
  
  const { state, actions } = useChatUIState(blueprintId);
  const { executeTransition, calculateTargetPosition, calculateTargetSize } = useLayoutTransition();
  
  const floatingRef = useRef<FloatingLayoutRef>(null);
  const sidebarRef = useRef<SidebarLayoutRef>(null);
  const fullpageRef = useRef<FullpageLayoutRef>(null);
  
  // 一時的な添付ファイル（プレビュー表示用）
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  // セッション中継続保持される画像（ChatGPT方式）
  const [sessionImage, setSessionImage] = useState<File | null>(null);

  // propsから渡されたエージェント設定を反映
  useEffect(() => {
    const agentConfigs = getAgentConfigs(availableAgents);
    console.log('Available agents:', availableAgents);
    console.log('Agent configs:', agentConfigs);
    actions.updateAvailableAgents(agentConfigs);
  }, [availableAgents]); // actions を依存配列から削除

  const blueprintInfo: BlueprintInfo | undefined = blueprint ? {
    id: blueprint.internalNumber,
    image: blueprint.image,
    name: `図面 ${blueprint.internalNumber}`,
    customerName: blueprint.orderSource,
    productName: blueprint.productName,
    material: blueprint.companyField
  } : undefined;

  // キーボードショートカット
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (!state.isOpen || state.isTransitioning) return;
      
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case '1':
            e.preventDefault();
            handleLayoutChange(ChatLayoutState.FLOATING);
            break;
          case '2':
            e.preventDefault();
            handleLayoutChange(ChatLayoutState.SIDEBAR);
            break;
          case '3':
            e.preventDefault();
            handleLayoutChange(ChatLayoutState.FULLPAGE);
            break;
        }
      }
      
      if (e.key === 'Escape') {
        e.preventDefault();
        actions.closeChat();
      }
    };

    document.addEventListener('keydown', handleKeydown);
    return () => document.removeEventListener('keydown', handleKeydown);
  }, [state.isOpen, state.isTransitioning, state.layoutState, actions.closeChat]);

  const handleLayoutChange = useCallback(async (newLayout: ChatLayoutState) => {
    if (newLayout === state.layoutState || state.isTransitioning) return;

    const currentRef = 
      state.layoutState === ChatLayoutState.FLOATING ? floatingRef.current :
      state.layoutState === ChatLayoutState.SIDEBAR ? sidebarRef.current :
      fullpageRef.current;

    const currentElement = currentRef?.getElement();
    if (!currentElement) return;

    const newPosition = calculateTargetPosition(newLayout, state.size);
    const newSize = calculateTargetSize(newLayout);

    try {
      await executeTransition(
        currentElement,
        state.layoutState,
        newLayout,
        state.position,
        state.size,
        newPosition,
        newSize
      );

      actions.updateLayoutState(newLayout);
      actions.updatePosition(newPosition);
      actions.updateSize(newSize);
    } catch (error) {
      console.warn('Transition failed:', error);
      actions.updateLayoutState(newLayout);
      actions.updatePosition(newPosition);
      actions.updateSize(newSize);
    }
  }, [state, actions.updateLayoutState, actions.updatePosition, actions.updateSize, executeTransition, calculateTargetPosition, calculateTargetSize]);

  const handleAgentSelect = useCallback((agentId: string) => {
    const agentConfig = getAgentConfig(agentId);
    if (agentConfig) {
      actions.selectAgent(agentId, agentConfig);
    }
  }, [actions.selectAgent]);


  const handleSendMessage = useCallback(async (content: string) => {
    if (!state.agentConfig || !state.selectedAgent) return;

    // 新規添付ファイルがあれば、セッション画像として保存
    if (attachedFile) {
      setSessionImage(attachedFile);
      setAttachedFile(null); // プレビューをクリア
    }

    // セッション画像または新規添付ファイルを使用
    const imageToSend = attachedFile || sessionImage;
    const hasImage = !!imageToSend;
    
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
      // 会話履歴を取得（typing除く）
      const conversationHistory = convertMessagesToHistory(
        state.messages.filter(msg => msg.id !== 'typing' && !msg.isTyping)
      );

      // ✅ 統一API使用 - セッション画像を使用（継続参照可能）
      const response = await sendUnifiedMessage(
        state.selectedAgent,
        content,
        {
          image: imageToSend || undefined,
          conversationHistory,
          metadata: blueprintInfo ? {
            blueprintInfo: {
              id: blueprintInfo.id,
              name: blueprintInfo.name,
              material: blueprintInfo.material,
              customerName: blueprintInfo.customerName,
              productName: blueprintInfo.productName
            }
          } : undefined
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
      
      // 送信後: attachedFileのみクリア、sessionImageは保持（ChatGPT方式）
      if (attachedFile) {
        setAttachedFile(null);
      }
      // sessionImageは継続保持（手動削除まで残る）
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
  }, [actions.addMessage, actions.setLoading, actions.removeMessage, state.agentConfig, state.selectedAgent, state.messages, blueprintInfo, attachedFile, sessionImage]);

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

  // セッション画像削除ハンドラー（明示的削除用）
  const handleRemoveSessionImage = useCallback(() => {
    setSessionImage(null);
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
              blueprintInfo={blueprintInfo}
              {...commonProps}
            />
          )}
        </>
      )}
    </>
  );
}