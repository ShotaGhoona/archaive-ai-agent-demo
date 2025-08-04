"use client";

import { useState, useCallback } from 'react';
import { Message } from '@/features/ai-agent/types/types';
import { createWelcomeMessage, createTypingMessage } from '../services/messageService';

/**
 * メッセージ管理のカスタムフック（MVPに必要な最小限の機能のみ）
 */
export function useMessageHandler() {
  const [messages, setMessages] = useState<Message[]>([
    createWelcomeMessage()
  ]);

  const addMessage = useCallback((message: Message) => {
    setMessages(prev => [...prev, message]);
  }, []);

  const addTypingMessage = useCallback(() => {
    setMessages(prev => [...prev, createTypingMessage()]);
  }, []);

  const removeTypingMessage = useCallback(() => {
    setMessages(prev => prev.filter(msg => msg.id !== 'typing'));
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([createWelcomeMessage()]);
  }, []);

  return {
    messages,
    addMessage,
    addTypingMessage,
    removeTypingMessage,
    clearMessages
  };
}