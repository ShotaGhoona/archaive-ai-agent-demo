"use client";

import { useState, useCallback, useEffect } from "react";
import { ChatLayoutState, ChatUIState, Position, Size, UserPreferences, Message } from "../types";
import { storageUtils, defaultPreferences } from "../utils/storageUtils";

const DEFAULT_POSITION: Position = { x: 50, y: 50 };
const DEFAULT_SIZE: Size = { width: 400, height: 700 };

const DEFAULT_STATE: ChatUIState = {
  layoutState: ChatLayoutState.FLOATING,
  isOpen: false,
  position: DEFAULT_POSITION,
  size: DEFAULT_SIZE,
  messages: [],
  isLoading: false,
  preferences: defaultPreferences,
  isTransitioning: false
};

export const useChatUIState = (blueprintId: string) => {
  const [state, setState] = useState<ChatUIState>(DEFAULT_STATE);

  // 初期化
  useEffect(() => {
    const storedPreferences = storageUtils.loadPreferences();
    const storedChatState = storageUtils.loadChatState();
    const storedSession = storageUtils.loadSession(blueprintId);

    setState(prev => ({
      ...prev,
      layoutState: storedPreferences.rememberLayout 
        ? (storedChatState.layoutState || storedPreferences.defaultLayout)
        : storedPreferences.defaultLayout,
      position: storedChatState.position || DEFAULT_POSITION,
      size: storedChatState.size || DEFAULT_SIZE,
      preferences: storedPreferences,
      messages: storedSession.messages
    }));
  }, [blueprintId]);

  // 状態変更時の永続化
  useEffect(() => {
    if (state.preferences.rememberLayout) {
      storageUtils.saveChatState({
        layoutState: state.layoutState,
        position: state.position,
        size: state.size,
        preferences: state.preferences
      });
    }
  }, [state.layoutState, state.position, state.size, state.preferences]);

  // メッセージ変更時のセッション保存
  useEffect(() => {
    if (state.messages.length > 0) {
      storageUtils.saveSession(blueprintId, state.messages);
    }
  }, [state.messages, blueprintId]);

  const updateLayoutState = useCallback((newLayoutState: ChatLayoutState) => {
    setState(prev => ({
      ...prev,
      layoutState: newLayoutState,
      isTransitioning: true
    }));

    // アニメーション完了後にフラグをリセット
    setTimeout(() => {
      setState(prev => ({ ...prev, isTransitioning: false }));
    }, 500);
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
    setState(prev => ({ ...prev, isOpen: false }));
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
    storageUtils.savePreferences(updatedPreferences);
  }, [state.preferences]);

  const resetState = useCallback(() => {
    setState(DEFAULT_STATE);
    storageUtils.clearAll();
  }, []);

  return {
    state,
    actions: {
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
      resetState
    }
  };
};