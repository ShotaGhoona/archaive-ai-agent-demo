"use client";

import { ChatLayoutState, PersistedChatState, UserPreferences } from "../types";

const STORAGE_KEYS = {
  CHAT_STATE: 'archaive_chat_state',
  PREFERENCES: 'archaive_chat_preferences',
  SESSION: 'archaive_chat_session'
} as const;

export const defaultPreferences: UserPreferences = {
  defaultLayout: ChatLayoutState.FLOATING,
  rememberLayout: true,
  animations: true,
  autoResize: true
};

export const storageUtils = {
  // 設定の保存・読み込み
  savePreferences: (preferences: UserPreferences): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(preferences));
    } catch (error) {
      console.warn('Failed to save preferences:', error);
    }
  },

  loadPreferences: (): UserPreferences => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
      if (stored) {
        return { ...defaultPreferences, ...JSON.parse(stored) };
      }
    } catch (error) {
      console.warn('Failed to load preferences:', error);
    }
    return defaultPreferences;
  },

  // チャット状態の保存・読み込み
  saveChatState: (state: Partial<PersistedChatState>): void => {
    try {
      const existing = storageUtils.loadChatState();
      const updated = { ...existing, ...state };
      localStorage.setItem(STORAGE_KEYS.CHAT_STATE, JSON.stringify(updated));
    } catch (error) {
      console.warn('Failed to save chat state:', error);
    }
  },

  loadChatState: (): Partial<PersistedChatState> => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CHAT_STATE);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Failed to load chat state:', error);
    }
    return {};
  },

  // セッションデータの管理
  saveSession: (blueprintId: string, messages: any[]): void => {
    try {
      const sessionData = {
        messages,
        lastActive: new Date(),
        blueprintId
      };
      sessionStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(sessionData));
    } catch (error) {
      console.warn('Failed to save session:', error);
    }
  },

  loadSession: (blueprintId: string): { messages: any[] } => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEYS.SESSION);
      if (stored) {
        const sessionData = JSON.parse(stored);
        if (sessionData.blueprintId === blueprintId) {
          return { messages: sessionData.messages || [] };
        }
      }
    } catch (error) {
      console.warn('Failed to load session:', error);
    }
    return { messages: [] };
  },

  // データクリア
  clearAll: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEYS.CHAT_STATE);
      localStorage.removeItem(STORAGE_KEYS.PREFERENCES);
      sessionStorage.removeItem(STORAGE_KEYS.SESSION);
    } catch (error) {
      console.warn('Failed to clear storage:', error);
    }
  },

  clearSession: (): void => {
    try {
      sessionStorage.removeItem(STORAGE_KEYS.SESSION);
    } catch (error) {
      console.warn('Failed to clear session:', error);
    }
  }
};