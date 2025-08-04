"use client";

import { useState, useCallback, useMemo } from "react";
import { ChatLayoutState, ChatUIState, Position, Size, UserPreferences, Message, AIAgentConfig } from "../../types/types";

const DEFAULT_POSITION: Position = { x: 50, y: 50 };
const DEFAULT_SIZE: Size = { width: 400, height: 700 };

const defaultPreferences: UserPreferences = {
  defaultLayout: ChatLayoutState.FLOATING,
  rememberLayout: false,
  animations: true,
  autoResize: true
};

const DEFAULT_STATE: ChatUIState = {
  layoutState: ChatLayoutState.FLOATING,
  isOpen: false,
  position: DEFAULT_POSITION,
  size: DEFAULT_SIZE,
  messages: [],
  isLoading: false,
  preferences: defaultPreferences,
  selectedAgent: null,
  agentConfig: null,
  selectorOpen: false,
  availableAgents: []
};

export const useChatUIState = (blueprintId: string) => {
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

  const toggleChat = useCallback(() => {
    setState(prev => ({ ...prev, isOpen: !prev.isOpen }));
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

  const toggleSelector = useCallback(() => {
    setState(prev => ({ ...prev, selectorOpen: !prev.selectorOpen }));
  }, []);

  const openSelector = useCallback(() => {
    setState(prev => ({ ...prev, selectorOpen: true }));
  }, []);

  const closeSelector = useCallback(() => {
    setState(prev => ({ ...prev, selectorOpen: false }));
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

  const updatePreferences = useCallback((newPreferences: Partial<UserPreferences>) => {
    const updatedPreferences = { ...state.preferences, ...newPreferences };
    setState(prev => ({ ...prev, preferences: updatedPreferences }));
  }, [state.preferences]);

  const resetState = useCallback(() => {
    setState(DEFAULT_STATE);
  }, []);

  const actions = useMemo(() => ({
    updateLayoutState,
    updatePosition,
    updateSize,
    toggleChat,
    openChat,
    closeChat,
    addMessage,
    removeMessage,
    updateMessages,
    setLoading,
    updatePreferences,
    resetState,
    selectAgent,
    updateAvailableAgents,
    toggleSelector,
    openSelector,
    closeSelector
  }), [
    updateLayoutState,
    updatePosition,
    updateSize,
    toggleChat,
    openChat,
    closeChat,
    addMessage,
    removeMessage,
    updateMessages,
    setLoading,
    updatePreferences,
    resetState,
    selectAgent,
    updateAvailableAgents,
    toggleSelector,
    openSelector,
    closeSelector
  ]);

  return {
    state,
    actions
  };
};