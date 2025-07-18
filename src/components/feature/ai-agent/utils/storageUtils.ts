"use client";

import { ChatLayoutState, PersistedChatState, UserPreferences } from "../types/types";

const STORAGE_KEYS = {
  CHAT_STATE: 'archaive_chat_state_v6',
  PREFERENCES: 'archaive_chat_preferences_v6',
  SESSION: 'archaive_chat_session_v6'
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

  // セッションデータの管理（エージェント別）
  saveSession: (blueprintId: string, messages: any[], agentId?: string): void => {
    try {
      const sessionKey = agentId ? `${blueprintId}_${agentId}` : blueprintId;
      const sessionData = {
        messages,
        lastActive: new Date(),
        blueprintId,
        agentId
      };
      sessionStorage.setItem(`${STORAGE_KEYS.SESSION}_${sessionKey}`, JSON.stringify(sessionData));
    } catch (error) {
      console.warn('Failed to save session:', error);
    }
  },

  loadSession: (blueprintId: string, agentId?: string): { messages: any[] } => {
    try {
      const sessionKey = agentId ? `${blueprintId}_${agentId}` : blueprintId;
      const stored = sessionStorage.getItem(`${STORAGE_KEYS.SESSION}_${sessionKey}`);
      if (stored) {
        const sessionData = JSON.parse(stored);
        if (sessionData.blueprintId === blueprintId && 
            (!agentId || sessionData.agentId === agentId)) {
          return { messages: sessionData.messages || [] };
        }
      }
    } catch (error) {
      console.warn('Failed to load session:', error);
    }
    return { messages: [] };
  },

  // エージェント使用履歴の保存
  saveAgentUsage: (agentId: string, timestamp: Date = new Date()): void => {
    try {
      const usage = storageUtils.loadAgentUsage();
      usage[agentId] = timestamp.toISOString();
      localStorage.setItem(`${STORAGE_KEYS.CHAT_STATE}_agent_usage`, JSON.stringify(usage));
    } catch (error) {
      console.warn('Failed to save agent usage:', error);
    }
  },

  loadAgentUsage: (): Record<string, string> => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEYS.CHAT_STATE}_agent_usage`);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Failed to load agent usage:', error);
    }
    return {};
  },

  // データクリア
  clearAll: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEYS.CHAT_STATE);
      localStorage.removeItem(STORAGE_KEYS.PREFERENCES);
      localStorage.removeItem(`${STORAGE_KEYS.CHAT_STATE}_agent_usage`);
      // セッションストレージの関連データをクリア
      const sessionKeys = Object.keys(sessionStorage);
      sessionKeys.forEach(key => {
        if (key.startsWith(STORAGE_KEYS.SESSION)) {
          sessionStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.warn('Failed to clear storage:', error);
    }
  },

  clearSession: (blueprintId?: string, agentId?: string): void => {
    try {
      if (blueprintId) {
        const sessionKey = agentId ? `${blueprintId}_${agentId}` : blueprintId;
        sessionStorage.removeItem(`${STORAGE_KEYS.SESSION}_${sessionKey}`);
      } else {
        // 全セッションクリア
        const sessionKeys = Object.keys(sessionStorage);
        sessionKeys.forEach(key => {
          if (key.startsWith(STORAGE_KEYS.SESSION)) {
            sessionStorage.removeItem(key);
          }
        });
      }
    } catch (error) {
      console.warn('Failed to clear session:', error);
    }
  }
};