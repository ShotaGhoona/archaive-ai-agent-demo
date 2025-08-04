import { Position, Size } from "../types/types";

// レイアウト関連の定数
export const DEFAULT_FLOATING_POSITION: Position = { x: 50, y: 50 };
export const DEFAULT_FLOATING_SIZE: Size = { width: 400, height: 700 };

export const DEFAULT_SIDEBAR_SIZE: Size = { 
  width: 384, 
  height: typeof window !== 'undefined' ? window.innerHeight : 800 
};

export const DEFAULT_FULLPAGE_SIZE: Size = { 
  width: typeof window !== 'undefined' ? window.innerWidth * 0.8 : 1200, 
  height: typeof window !== 'undefined' ? window.innerHeight * 0.8 : 800 
};

// メッセージ関連の定数
export const TYPING_MESSAGE_ID = 'typing';
export const WELCOME_MESSAGE_ID = 'welcome';

// タイムアウト設定
export const API_TIMEOUT = 30000; // 30秒
export const TYPING_DELAY = 300; // 300ms

// エージェント別の設定
export const AGENT_SPECIFIC_CONFIG = {
  trouble: {
    skipAPI: true, // APIを呼ばずにフロントエンドで処理
  },
  estimate: {
    skipAPI: false,
  },
  general: {
    skipAPI: false,
  }
};

// アニメーション設定
export const TRANSITION_DURATION = 200; // ms
export const EASE_CURVE = 'cubic-bezier(0.4, 0, 0.2, 1)';