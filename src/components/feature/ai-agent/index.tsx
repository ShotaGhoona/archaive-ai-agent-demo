"use client";

import { useCallback, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import { ChatLayoutState, Message, BlueprintInfo, ChatUIManagerProps } from "./types/types";
import { useChatUIState } from "./shared/hooks/useChatUIState";
import { useLayoutTransition } from "./shared/hooks/useLayoutTransition";
import { getAgentConfigs, getAgentConfig } from "./utils/agentConfigs";
import { sendAgentMessage, convertMessagesToHistory } from "./utils/chatApi";
import ChatButton from "./shared/components/ChatButton";
import FloatingLayout, { FloatingLayoutRef } from "./shared/layouts/FloatingLayout";
import SidebarLayout, { SidebarLayoutRef } from "./shared/layouts/SidebarLayout";
import FullpageLayout, { FullpageLayoutRef } from "./shared/layouts/FullpageLayout";
import GeneralChatContent from "./agents/GeneralAgent/GeneralChatContent";
import EstimateChatContent from "./agents/EstimateAgent/EstimateChatContent";
import ChatInput from "./shared/components/ChatInput";
import blueprintsData from "@/components/feature/blueprint/data/blueprint.json";

// エージェント別レスポンス生成
const generateAgentResponse = (userMessage: string, agentId: string): string => {
  const responses = {
    general: [
      "マルチエージェントシステムで最適な回答を提供します。",
      "図面に関するご質問、何でもお答えします。",
      "詳細な情報が必要でしたら、専門エージェントもご利用ください。",
      "お手伝いできることがあれば、遠慮なくお聞かせください。",
    ],
    estimate: [
      "見積もりを計算中です。図面の詳細を解析しています。",
      "材料費と工賃を含めた詳細な見積もりを作成いたします。",
      "図面の寸法から必要な材料を算出しています。",
      "コスト最適化の提案も合わせて検討いたします。",
    ],
    process: [
      "製造工程を最適化しています。効率性を重視した提案をいたします。",
      "工程間のボトルネックを分析し、改善案を検討中です。",
      "並行作業により工期短縮が可能です。詳細をご説明します。",
      "品質を保ちながら効率を向上させる工程設計を提案します。",
    ],
    inquiry: [
      "よくある質問からお答えします。迅速な回答を心がけています。",
      "詳細な情報については、関連資料も合わせてご確認ください。",
      "ご不明な点がございましたら、お気軽にお聞かせください。",
      "サポート担当が丁寧にご回答いたします。",
    ]
  };

  const agentResponses = responses[agentId as keyof typeof responses] || responses.general;
  return agentResponses[Math.floor(Math.random() * agentResponses.length)];
};

// エージェント別コンテンツレンダラー
const AgentContentRenderer = ({ agentId, messages, isLoading, agentConfig, onFileUpload }: any) => {
  if (!agentConfig) return null;

  switch (agentId) {
    case 'general':
      return <GeneralChatContent messages={messages} isLoading={isLoading} agentConfig={agentConfig} />;
    case 'estimate':
      return <EstimateChatContent messages={messages} isLoading={isLoading} agentConfig={agentConfig} onFileUpload={onFileUpload} />;
    // case 'process':
    //   return <ProcessChatContent messages={messages} isLoading={isLoading} agentConfig={agentConfig} />;
    // case 'inquiry':
    //   return <InquiryChatContent messages={messages} isLoading={isLoading} agentConfig={agentConfig} />;
    default:
      return <GeneralChatContent messages={messages} isLoading={isLoading} agentConfig={agentConfig} />;
  }
};

// 共有チャットインプット使用
const AgentInputRenderer = ({ agentId, onSendMessage, onQuickAction, disabled, agentConfig }: any) => {
  if (!agentConfig) return null;

  return (
    <ChatInput
      onSendMessage={onSendMessage}
      onQuickAction={onQuickAction}
      disabled={disabled}
      agentConfig={agentConfig}
    />
  );
};

export default function ChatUIManager({ availableAgents }: ChatUIManagerProps) {
  const params = useParams();
  const blueprintId = params.id as string;
  const blueprint = blueprintsData.find((item) => item.id === blueprintId);
  
  const { state, actions } = useChatUIState(blueprintId);
  const { executeTransition, calculateTargetPosition, calculateTargetSize } = useLayoutTransition();
  
  const floatingRef = useRef<FloatingLayoutRef>(null);
  const sidebarRef = useRef<SidebarLayoutRef>(null);
  const fullpageRef = useRef<FullpageLayoutRef>(null);
  
  // セッション中の画像を保持
  const sessionImageRef = useRef<File | null>(null);

  // propsから渡されたエージェント設定を反映
  useEffect(() => {
    const agentConfigs = getAgentConfigs(availableAgents);
    actions.updateAvailableAgents(agentConfigs);
  }, [availableAgents]); // actions を依存配列から削除

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

    const userMessage: Message = {
      id: Date.now().toString(),
      content: sessionImageRef.current ? `${content} [画像参照]` : content,
      sender: 'user',
      timestamp: new Date(),
    };

    actions.addMessage(userMessage);
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

      // API呼び出し（セッション画像があれば含める）
      const response = await sendAgentMessage(
        state.selectedAgent,
        content,
        {
          image: sessionImageRef.current || undefined,
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
  }, [actions.addMessage, actions.setLoading, actions.removeMessage, state.agentConfig, state.selectedAgent, state.messages, blueprintInfo]);

  const handleQuickAction = useCallback((action: string) => {
    handleSendMessage(action);
  }, [handleSendMessage]);

  // ファイルアップロードハンドラー
  const handleFileUpload = useCallback(async (file: File, message: string) => {
    if (!state.selectedAgent) return;

    // セッション中の画像として保持
    sessionImageRef.current = file;

    // ユーザーメッセージを追加
    const userMessage: Message = {
      id: Date.now().toString(),
      content: `${message} [画像: ${file.name}]`,
      sender: 'user',
      timestamp: new Date(),
    };

    actions.addMessage(userMessage);
    actions.setLoading(true);

    // AIの応答準備（typing表示）
    const typingMessage: Message = {
      id: 'typing',
      content: '...',
      sender: 'ai',
      timestamp: new Date(),
      isTyping: true
    };
    actions.addMessage(typingMessage);

    try {
      // 会話履歴を取得（typing除く）
      const conversationHistory = convertMessagesToHistory(
        state.messages.filter(msg => msg.id !== 'typing' && !msg.isTyping)
      );

      // ファイル付きAPIコール
      const response = await sendAgentMessage(
        state.selectedAgent,
        message,
        {
          image: file,
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
    } catch (error) {
      console.error('Failed to upload file:', error);
      
      const fallbackResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: error instanceof Error 
          ? `申し訳ございません。ファイルアップロードでエラーが発生しました: ${error.message}`
          : 'ファイルアップロードでエラーが発生しました。しばらくしてからもう一度お試しください。',
        sender: 'ai',
        timestamp: new Date(),
      };

      actions.removeMessage('typing');
      actions.addMessage(fallbackResponse);
      actions.setLoading(false);
    }
  }, [actions.addMessage, actions.setLoading, actions.removeMessage, state.agentConfig, state.selectedAgent, state.messages, blueprintInfo]);

  const commonProps = {
    messages: state.messages,
    isLoading: state.isLoading,
    onLayoutChange: handleLayoutChange,
    onClose: actions.closeChat,
    onSendMessage: handleSendMessage,
    onQuickAction: handleQuickAction,
    selectedAgent: state.selectedAgent,
    agentConfig: state.agentConfig,
    // エージェント別コンテンツ
    agentContent: state.selectedAgent ? (
      <AgentContentRenderer
        agentId={state.selectedAgent}
        messages={state.messages}
        isLoading={state.isLoading}
        agentConfig={state.agentConfig}
        onFileUpload={handleFileUpload}
      />
    ) : null,
    // エージェント別インプット
    agentInput: state.selectedAgent ? (
      <AgentInputRenderer
        agentId={state.selectedAgent}
        onSendMessage={handleSendMessage}
        onQuickAction={handleQuickAction}
        disabled={state.isLoading}
        agentConfig={state.agentConfig}
      />
    ) : null
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