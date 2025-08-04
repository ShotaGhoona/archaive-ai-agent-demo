"use client";

import { useEffect, useRef, useState } from "react";
import { Message } from "../../types/types";
import ChatMessage from "../../shared/components/ChatMessage";
import { MessageSquare } from "lucide-react";
import { parseUserInput } from "./utils/searchUtils";
import { formatSearchResults } from "./utils/formatUtils";
import { SearchResult, ChatContentProps } from "./types";

// 🎯 カコトラAI専用のウェルカムメッセージ
const TROUBLE_WELCOME_MESSAGE = '過去のトラブル事例、見積もり、仕様書を図面から検索できます。+ボタンから図面を添付するか、キーワードで検索してください。';

export default function ChatContent({ messages, agentConfig }: ChatContentProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [hasShownWelcome, setHasShownWelcome] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // 初回ウェルカムメッセージを表示
  useEffect(() => {
    if (messages.length === 0 && !hasShownWelcome) {
      setHasShownWelcome(true);
    }
  }, [messages, hasShownWelcome]);

  // ユーザーの入力を処理
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.sender === 'user') {
      const results = parseUserInput(lastMessage.content);
      if (results) {
        setSearchResults(results);
      }
    }
  }, [messages]);

  // ウェルカムメッセージと検索オプションメッセージを追加
  const welcomeMessages: Message[] = hasShownWelcome && messages.length === 0 ? [
    {
      id: 'welcome-1',
      content: '過去のトラブル事例、見積もり、仕様書を図面から検索できます。',
      sender: 'ai',
      timestamp: new Date()
    },
    {
      id: 'welcome-2',
      content: `カコトラAIで検索したい情報の種類を選択してください：\n\n1. トラブル情報\n2. 見積もり情報\n3. 仕様書情報\n\n番号で選択するか、「すべて」と入力してください。`,
      sender: 'ai',
      timestamp: new Date()
    }
  ] : [];

  // 検索結果メッセージを追加
  const formattedResult = searchResults ? formatSearchResults(searchResults) : null;
  const searchResultMessage: Message | null = formattedResult ? {
    id: 'search-result',
    content: formattedResult,
    sender: 'ai',
    timestamp: new Date()
  } : null;

  const allMessages = [...welcomeMessages, ...messages];
  if (searchResultMessage && !allMessages.find(m => m.id === 'search-result')) {
    allMessages.push(searchResultMessage);
  }
  
  const displayMessages = allMessages.filter(msg => 
    !msg.content.includes('typing') || msg.sender !== 'ai'
  );

  return (
    <div className="flex-1 flex flex-col h-full min-h-0">
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {displayMessages.length === 0 && !hasShownWelcome && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <MessageSquare className="w-8 h-8 text-blue-600" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900">
                {agentConfig.name}へようこそ
              </h3>
              <p className="text-gray-600 max-w-md">
                {TROUBLE_WELCOME_MESSAGE}
              </p>
            </div>
          </div>
        )}

        {/* セッション画像プレビュー */}
        {/* {sessionImage && (
          <SessionImagePreview image={sessionImage} />
        )} */}

        {displayMessages.map((message) => (
          <ChatMessage 
            key={message.id} 
            message={message} 
            agentConfig={agentConfig}
          />
        ))}
      </div>
    </div>
  );
}