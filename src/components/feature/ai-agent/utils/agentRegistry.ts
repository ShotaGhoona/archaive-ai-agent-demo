"use client";

import React from 'react';
import { AIAgentConfig } from '../types/types';

/**
 * エージェント登録・管理システム
 * 拡張性と保守性を考慮したレジストリパターンの実装
 */
class AgentRegistry {
  private agents: Map<string, AIAgentConfig> = new Map();
  private listeners: Set<(agents: AIAgentConfig[]) => void> = new Set();

  /**
   * エージェントを登録
   */
  register(agent: AIAgentConfig): void {
    this.agents.set(agent.id, agent);
    this.notifyListeners();
  }

  /**
   * 複数のエージェントを一括登録
   */
  registerMany(agents: AIAgentConfig[]): void {
    agents.forEach(agent => {
      this.agents.set(agent.id, agent);
    });
    this.notifyListeners();
  }

  /**
   * エージェントを取得
   */
  get(id: string): AIAgentConfig | undefined {
    return this.agents.get(id);
  }

  /**
   * 全エージェントを取得
   */
  getAll(): AIAgentConfig[] {
    return Array.from(this.agents.values());
  }

  /**
   * 指定されたIDのエージェント群を取得
   */
  getMany(ids: string[]): AIAgentConfig[] {
    return ids
      .map(id => this.agents.get(id))
      .filter((agent): agent is AIAgentConfig => agent !== undefined);
  }

  /**
   * エージェントが存在するかチェック
   */
  has(id: string): boolean {
    return this.agents.has(id);
  }

  /**
   * エージェントを削除
   */
  unregister(id: string): boolean {
    const result = this.agents.delete(id);
    if (result) {
      this.notifyListeners();
    }
    return result;
  }

  /**
   * カテゴリーでフィルタリング
   */
  getByCategory(category: string): AIAgentConfig[] {
    return Array.from(this.agents.values()).filter(
      agent => agent.category === category
    );
  }

  /**
   * 名前で検索（部分一致）
   */
  searchByName(query: string): AIAgentConfig[] {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.agents.values()).filter(
      agent => agent.name.toLowerCase().includes(lowerQuery) ||
               agent.description.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * エージェント設定の妥当性検証
   */
  validate(agent: AIAgentConfig): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // 必須フィールドのチェック
    if (!agent.id || agent.id.trim() === '') {
      errors.push('ID is required');
    }

    if (!agent.name || agent.name.trim() === '') {
      errors.push('Name is required');
    }

    if (!agent.icon) {
      errors.push('Icon is required');
    }

    if (!agent.color || !agent.color.match(/^#[0-9A-Fa-f]{6}$/)) {
      errors.push('Valid color (hex format) is required');
    }

    // 重複IDのチェック
    if (this.agents.has(agent.id)) {
      errors.push(`Agent with ID '${agent.id}' already exists`);
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * 動的エージェント登録（妥当性チェック付き）
   */
  registerSafe(agent: AIAgentConfig): { success: boolean; errors: string[] } {
    const validation = this.validate(agent);
    
    if (!validation.valid) {
      return {
        success: false,
        errors: validation.errors
      };
    }

    this.register(agent);
    return {
      success: true,
      errors: []
    };
  }

  /**
   * エージェント更新
   */
  update(id: string, updates: Partial<AIAgentConfig>): boolean {
    const existingAgent = this.agents.get(id);
    if (!existingAgent) {
      return false;
    }

    const updatedAgent = { ...existingAgent, ...updates, id }; // IDは変更不可
    this.agents.set(id, updatedAgent);
    this.notifyListeners();
    return true;
  }

  /**
   * 変更通知リスナーを追加
   */
  addListener(listener: (agents: AIAgentConfig[]) => void): void {
    this.listeners.add(listener);
  }

  /**
   * 変更通知リスナーを削除
   */
  removeListener(listener: (agents: AIAgentConfig[]) => void): void {
    this.listeners.delete(listener);
  }

  /**
   * 統計情報を取得
   */
  getStats(): {
    totalAgents: number;
    categories: Record<string, number>;
    averageQuickActions: number;
  } {
    const agents = this.getAll();
    const categories: Record<string, number> = {};
    let totalQuickActions = 0;

    agents.forEach(agent => {
      categories[agent.category] = (categories[agent.category] || 0) + 1;
      totalQuickActions += agent.quickActions?.length || 0;
    });

    return {
      totalAgents: agents.length,
      categories,
      averageQuickActions: agents.length > 0 ? totalQuickActions / agents.length : 0
    };
  }

  /**
   * エージェント設定をエクスポート（バックアップ用）
   */
  export(): AIAgentConfig[] {
    return this.getAll();
  }

  /**
   * エージェント設定をインポート
   */
  import(agents: AIAgentConfig[], overwrite: boolean = false): {
    success: boolean;
    imported: number;
    errors: string[];
  } {
    const errors: string[] = [];
    let imported = 0;

    agents.forEach(agent => {
      if (!overwrite && this.has(agent.id)) {
        errors.push(`Agent '${agent.id}' already exists (skipped)`);
        return;
      }

      const validation = this.validate(agent);
      if (!validation.valid) {
        errors.push(`Agent '${agent.id}': ${validation.errors.join(', ')}`);
        return;
      }

      this.register(agent);
      imported++;
    });

    return {
      success: errors.length === 0,
      imported,
      errors
    };
  }

  /**
   * レジストリをクリア
   */
  clear(): void {
    this.agents.clear();
    this.notifyListeners();
  }

  /**
   * リスナーに変更を通知
   */
  private notifyListeners(): void {
    const agents = this.getAll();
    this.listeners.forEach(listener => {
      try {
        listener(agents);
      } catch (error) {
        console.error('Error in agent registry listener:', error);
      }
    });
  }
}

// シングルトンインスタンス
export const agentRegistry = new AgentRegistry();


// ユーティリティ関数
export const createAgent = (config: Omit<AIAgentConfig, 'id'> & { id?: string }): AIAgentConfig => {
  return {
    id: config.id || `agent-${Date.now()}`,
    name: config.name,
    icon: config.icon,
    description: config.description,
    color: config.color,
    category: config.category,
    welcomeMessage: config.welcomeMessage,
    defaultInput: config.defaultInput,
    quickActions: config.quickActions || []
  };
};


// React Hook for agent registry

export const useAgentRegistry = () => {
  const [agents, setAgents] = React.useState<AIAgentConfig[]>(agentRegistry.getAll());

  React.useEffect(() => {
    const listener = (updatedAgents: AIAgentConfig[]) => {
      setAgents(updatedAgents);
    };

    agentRegistry.addListener(listener);
    return () => agentRegistry.removeListener(listener);
  }, []);

  return {
    agents,
    register: agentRegistry.register.bind(agentRegistry),
    unregister: agentRegistry.unregister.bind(agentRegistry),
    get: agentRegistry.get.bind(agentRegistry),
    getMany: agentRegistry.getMany.bind(agentRegistry),
    searchByName: agentRegistry.searchByName.bind(agentRegistry),
    getByCategory: agentRegistry.getByCategory.bind(agentRegistry),
    getStats: agentRegistry.getStats.bind(agentRegistry)
  };
};

export default AgentRegistry;