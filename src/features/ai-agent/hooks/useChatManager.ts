"use client";

import { useCallback, useState } from "react";
import { Message } from "../types/types";
import { sendUnifiedMessage } from "../utils/chatApi";
import { createUserMessage, createTypingMessage, createAIMessage, createErrorMessage } from "../utils/messageFactory";
import { handleTroubleMessage } from "../agents/TroubleAgent/messageHandler";

interface UseChatManagerProps {
  selectedAgent: string | null;
  agentConfig: unknown;
  addMessage: (message: Message) => void;
  removeMessage: (messageId: string) => void;
  setLoading: (loading: boolean) => void;
}

export const useChatManager = ({
  selectedAgent,
  agentConfig,
  addMessage,
  removeMessage,
  setLoading
}: UseChatManagerProps) => {
  const [attachedFile, setAttachedFile] = useState<File | null>(null);

  const handleSendMessage = useCallback(async (content: string) => {
    if (!agentConfig || !selectedAgent) return;

    const hasImage = !!attachedFile;
    
    // ユーザーメッセージを追加
    const userMessage = createUserMessage(content, hasImage);
    addMessage(userMessage);
    
    // カコトラAI（trouble）の場合は、専用ハンドラーで処理
    if (selectedAgent === 'trouble') {
      setLoading(true);
      
      // タイピング中のメッセージを表示
      const typingMessage = createTypingMessage();
      addMessage(typingMessage);
      
      try {
        // TroubleAgent専用のメッセージハンドラーを呼び出し
        const aiResponse = await handleTroubleMessage(content);
        
        removeMessage('typing');
        addMessage(aiResponse);
        setLoading(false);
      } catch (error) {
        console.error('Failed to handle trouble message:', error);
        
        const errorMessage = createErrorMessage(error);
        removeMessage('typing');
        addMessage(errorMessage);
        setLoading(false);
      }
      
      return;
    }
    
    // その他のエージェントは通常通りAPIを呼ぶ
    setLoading(true);

    // タイピング中のメッセージを表示
    const typingMessage = createTypingMessage();
    addMessage(typingMessage);

    try {
      // ダミーAPIを呼び出し
      const response = await sendUnifiedMessage(
        selectedAgent,
        content,
        {
          image: attachedFile || undefined
        }
      );

      // AI応答メッセージを作成
      const aiResponse = createAIMessage(response.response);

      removeMessage('typing');
      addMessage(aiResponse);
      setLoading(false);
      
      // 送信後に添付ファイルをクリア
      setAttachedFile(null);
    } catch (error) {
      console.error('Failed to send message:', error);
      
      // エラーメッセージを作成
      const errorMessage = createErrorMessage(error);
      
      removeMessage('typing');
      addMessage(errorMessage);
      setLoading(false);
    }
  }, [selectedAgent, agentConfig, attachedFile, addMessage, removeMessage, setLoading]);

  const handleQuickAction = useCallback((action: string) => {
    handleSendMessage(action);
  }, [handleSendMessage]);

  const handleFileAttach = useCallback((file: File) => {
    setAttachedFile(file);
  }, []);

  const handleRemoveAttachment = useCallback(() => {
    setAttachedFile(null);
  }, []);

  return {
    handleSendMessage,
    handleQuickAction,
    handleFileAttach,
    handleRemoveAttachment,
    attachedFile
  };
};