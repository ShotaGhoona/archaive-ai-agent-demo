"use client";

import { useCallback, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import { ChatLayoutState, Message, BlueprintInfo } from "./types";
import { useChatUIState } from "./hooks/useChatUIState";
import { useLayoutTransition } from "./hooks/useLayoutTransition";
import ChatButton from "./shared/ChatButton";
import FloatingLayout, { FloatingLayoutRef } from "./layouts/FloatingLayout";
import SidebarLayout, { SidebarLayoutRef } from "./layouts/SidebarLayout";
import FullpageLayout, { FullpageLayoutRef } from "./layouts/FullpageLayout";
import blueprintsData from "@/components/feature/blueprint/data/blueprint.json";

// ダミー応答生成
const generateDummyResponse = (userMessage: string): string => {
  const responses = [
    "マルチステートUIで最適な作業環境をご提供します。状態を自由に切り替えてお使いください。",
    "図面の詳細について、どの表示モードでも快適にご相談いただけます。",
    "技術的なサポートを全画面モード、サイドバーモード、浮遊モードで提供いたします。",
    "シームレスな状態遷移により、作業の流れを妨げることなくサポートします。",
    "レイアウトを切り替えながら、最適な作業環境でご質問にお答えします。",
  ];
  
  if (userMessage.includes("レイアウト") || userMessage.includes("モード")) {
    return "レイアウトの切り替えについてご質問ですね。ヘッダーのボタンで浮遊、サイドバー、フルページの3つのモードを自由に切り替えできます。各モードの特徴やメリットについて詳しく説明いたします。";
  }
  if (userMessage.includes("図面") || userMessage.includes("設計")) {
    return "図面・設計に関するご質問ですね。どのレイアウトモードでも図面の詳細情報や技術的なサポートを提供できます。フルページモードでは図面プレビューも表示されるため、より詳細な相談が可能です。";
  }
  
  return responses[Math.floor(Math.random() * responses.length)];
};

export default function ChatUIManager() {
  const params = useParams();
  const blueprintId = params.id as string;
  const blueprint = blueprintsData.find((item) => item.id === blueprintId);
  
  const { state, actions } = useChatUIState(blueprintId);
  const { executeTransition, calculateTargetPosition, calculateTargetSize } = useLayoutTransition();
  
  const floatingRef = useRef<FloatingLayoutRef>(null);
  const sidebarRef = useRef<SidebarLayoutRef>(null);
  const fullpageRef = useRef<FullpageLayoutRef>(null);

  const blueprintInfo: BlueprintInfo | undefined = blueprint ? {
    id: blueprint.id,
    image: blueprint.image,
    name: `図面 ${blueprint.id}`,
    customerName: blueprint.customerName,
    productName: blueprint.productName,
    material: blueprint.material
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
  }, [state.isOpen, state.isTransitioning, state.layoutState]);

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

    // アニメーション実行
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

      // 状態更新
      actions.updateLayoutState(newLayout);
      actions.updatePosition(newPosition);
      actions.updateSize(newSize);
    } catch (error) {
      console.warn('Transition failed:', error);
      // フォールバック: 即座に状態変更
      actions.updateLayoutState(newLayout);
      actions.updatePosition(newPosition);
      actions.updateSize(newSize);
    }
  }, [state, actions, executeTransition, calculateTargetPosition, calculateTargetSize]);

  const handleSendMessage = useCallback(async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date(),
    };

    actions.addMessage(userMessage);
    actions.setLoading(true);

    // タイピングインジケーター
    const typingMessage: Message = {
      id: 'typing',
      content: '',
      sender: 'ai',
      timestamp: new Date(),
      isTyping: true,
    };
    actions.addMessage(typingMessage);

    // ダミー遅延
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: generateDummyResponse(content),
        sender: 'ai',
        timestamp: new Date(),
      };

      // タイピングメッセージを削除してAI応答を追加
      actions.removeMessage('typing');
      actions.addMessage(aiResponse);
      actions.setLoading(false);
    }, 1000 + Math.random() * 2000);
  }, [actions, state.messages]);

  const handleQuickAction = useCallback((action: string) => {
    const actionMessage = `${action}機能を実行します。マルチステートUIで最適な表示モードをお選びください。`;
    handleSendMessage(actionMessage);
  }, [handleSendMessage]);

  const commonProps = {
    messages: state.messages,
    isLoading: state.isLoading,
    onLayoutChange: handleLayoutChange,
    onClose: actions.closeChat,
    onSendMessage: handleSendMessage,
    onQuickAction: handleQuickAction
  };

  return (
    <>
      {/* チャットボタン */}
      <ChatButton onClick={actions.toggleChat} isOpen={state.isOpen} />

      {/* レイアウト別レンダリング */}
      {state.isOpen && (
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