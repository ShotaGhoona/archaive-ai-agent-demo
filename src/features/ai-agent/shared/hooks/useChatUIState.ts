"use client";

import { useState, useCallback, useMemo } from "react";
import { ChatLayoutState, ChatUIState, Position, Size, Message, AIAgentConfig } from "../../types/types";

const DEFAULT_POSITION: Position = { x: 50, y: 50 };
const DEFAULT_SIZE: Size = { width: 400, height: 700 };

const DEFAULT_STATE: ChatUIState = {
  layoutState: ChatLayoutState.FLOATING,
  isOpen: false,
  position: DEFAULT_POSITION,
  size: DEFAULT_SIZE,
  messages: [],
  isLoading: false,
  selectedAgent: null,
  agentConfig: null,
  selectorOpen: false,
  availableAgents: []
};

export const useChatUIState = () => {
  const [state, setState] = useState<ChatUIState>(DEFAULT_STATE);

  const updateLayoutState = useCallback((newLayoutState: ChatLayoutState) => {
    setState(prev => ({
      ...prev,
      layoutState: newLayoutState
    }));
  }, []);

  const updatePosition = useCallback((newPosition: Position) => {
    setState(prev => ({ ...prev, position: newPosition }));
  }, []);

  const updateSize = useCallback((newSize: Size) => {
    setState(prev => ({ ...prev, size: newSize }));
  }, []);

  const openChat = useCallback(() => {
    setState(prev => ({ ...prev, isOpen: true }));
  }, []);

  const closeChat = useCallback(() => {
    setState(prev => ({ 
      ...prev, 
      isOpen: false,
      selectorOpen: false
    }));
  }, []);

  // 06新規追加 - エージェント関連
  const selectAgent = useCallback((agentId: string, agentConfig: AIAgentConfig) => {
    setState(prev => ({
      ...prev,
      selectedAgent: agentId,
      agentConfig,
      isOpen: true,
      selectorOpen: false,
      // エージェント変更時にメッセージをリセット
      messages: []
    }));
  }, []);

  const updateAvailableAgents = useCallback((agents: AIAgentConfig[]) => {
    setState(prev => ({
      ...prev,
      availableAgents: agents
    }));
  }, []);


  const addMessage = useCallback((message: Message) => {
    setState(prev => ({
      ...prev,
      messages: [...prev.messages, message]
    }));
  }, []);

  const removeMessage = useCallback((messageId: string) => {
    setState(prev => ({
      ...prev,
      messages: prev.messages.filter(msg => msg.id !== messageId)
    }));
  }, []);

  const updateMessages = useCallback((messages: Message[]) => {
    setState(prev => ({
      ...prev,
      messages
    }));
  }, []);

  const setLoading = useCallback((isLoading: boolean) => {
    setState(prev => ({ ...prev, isLoading }));
  }, []);


  const resetState = useCallback(() => {
    setState(DEFAULT_STATE);
  }, []);

  const actions = useMemo(() => ({
    updateLayoutState,
    updatePosition,
    updateSize,
    openChat,
    closeChat,
    addMessage,
    removeMessage,
    updateMessages,
    setLoading,
    resetState,
    selectAgent,
    updateAvailableAgents
  }), [
    updateLayoutState,
    updatePosition,
    updateSize,
    openChat,
    closeChat,
    addMessage,
    removeMessage,
    updateMessages,
    setLoading,
    resetState,
    selectAgent,
    updateAvailableAgents
  ]);

  return {
    state,
    actions
  };
};