"use client";

import { forwardRef, useRef, useImperativeHandle, lazy, Suspense } from "react";
import { ChatLayoutState, Message, AIAgentConfig } from "../../types/types";
import ChatHeader from "../components/ChatHeader";

interface FullpageLayoutProps {
  messages: Message[];
  isLoading: boolean;
  onLayoutChange: (layout: ChatLayoutState) => void;
  onClose: () => void;
  onSendMessage: (message: string) => void;
  onQuickAction: (action: string) => void;
  selectedAgent?: string | null;
  agentConfig?: unknown;
  agentContent?: React.ReactNode;
  agentInput?: React.ReactNode;
}

export interface FullpageLayoutRef {
  getElement: () => HTMLDivElement | null;
}

// Helper function to get agent-specific components
const getAgentComponents = (agentId: string) => {
  switch (agentId) {
    case 'trouble':
      return {
        ChatContent: lazy(() => import('../../agents/TroubleAgent/ChatContent')),
        ChatInput: lazy(() => import('../../agents/TroubleAgent/ChatInput'))
      };
    case 'estimate':
      return {
        ChatContent: lazy(() => import('../../agents/EstimateAgent/ChatContent')),
        ChatInput: lazy(() => import('../../agents/EstimateAgent/ChatInput'))
      };
    case 'general':
      return {
        ChatContent: lazy(() => import('../../agents/GeneralAgent/ChatContent')),
        ChatInput: lazy(() => import('../../agents/GeneralAgent/ChatInput'))
      };
    default:
      // Fallback to shared components
      return {
        ChatContent: lazy(() => import('../../agents/TroubleAgent/ChatContent')),
        ChatInput: lazy(() => import('../../agents/TroubleAgent/ChatInput'))
      };
  }
};

const FullpageLayout = forwardRef<FullpageLayoutRef, FullpageLayoutProps>(({
  messages,
  isLoading,
  onLayoutChange,
  onClose,
  onSendMessage,
  onQuickAction,
  // blueprintInfo,
  // selectedAgent,
  agentConfig,
  agentContent,
  agentInput
}, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  // TODO: チャット履歴の実装
  // const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  // const [showSidebar, setShowSidebar] = useState(true);

  useImperativeHandle(ref, () => ({
    getElement: () => containerRef.current
  }));

  // Get agent-specific components
  const agentId = (agentConfig as AIAgentConfig)?.id || '';
  const { ChatContent, ChatInput } = getAgentComponents(agentId);

  return (
    <>
      {/* バックドロップ */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      
      {/* モーダルコンテンツ */}
      <div
        ref={containerRef}
        className="fixed inset-0 z-55 flex items-center justify-center p-4"
      >
        <div 
          className="bg-background rounded-lg shadow-2xl border border-border overflow-hidden flex"
          style={{ width: '80vw', height: '80vh' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* TODO: 左サイドバー - チャット履歴 今後追加予定 */}
          {/* {showSidebar && (
            <div className="w-64 border-r border-border bg-muted/20 flex flex-col">
              <div className="p-3 border-b border-border">
                <h3 className="font-medium text-sm">チャット履歴</h3>
              </div>
              <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {[
                  "図面A-001の見積もり相談",
                  "製造工程の最適化について", 
                  "ステンレス材料について",
                  "一般的な相談"
                ].map((title, index) => (
                  <div
                    key={index}
                    className="p-2 rounded hover:bg-muted cursor-pointer text-sm"
                    onClick={() => setSelectedSessionId(`session-${index}`)}
                  >
                    <div className="truncate">{title}</div>
                    <div className="text-xs text-muted-foreground">
                      {index === 0 ? "30分前" : index === 1 ? "2時間前" : index === 2 ? "1日前" : "2日前"}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )} */}
          
          {/* メインチャット領域 */}
          <div className="flex-1 flex flex-col">
            {/* ヘッダー */}
            <ChatHeader
              currentLayout={ChatLayoutState.FULLPAGE}
              onLayoutChange={onLayoutChange}
              onClose={onClose}
              title={(agentConfig as { name?: string })?.name ? `${(agentConfig as { name: string }).name} Assistant` : "AI Assistant"}
            />
            
            {/* チャット内容 */}
            <div className="flex-1 overflow-hidden">
              {agentContent || (
                <Suspense fallback={<div className="flex items-center justify-center h-full">Loading...</div>}>
                  <ChatContent
                    messages={messages}
                    isLoading={isLoading}
                    onSendMessage={onSendMessage}
                    agentConfig={agentConfig as AIAgentConfig}
                  />
                </Suspense>
              )}
            </div>
            
            {/* 入力エリア */}
            {agentInput || (
              <Suspense fallback={<div className="p-4">Loading input...</div>}>
                <ChatInput
                  onSendMessage={onSendMessage}
                  onQuickAction={onQuickAction}
                  disabled={isLoading}
                  agentConfig={agentConfig as AIAgentConfig}
                />
              </Suspense>
            )}
          </div>
        </div>
      </div>
    </>
  );
});

FullpageLayout.displayName = "FullpageLayout";

export default FullpageLayout;