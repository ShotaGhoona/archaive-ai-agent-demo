export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  isTyping?: boolean;
}

export enum ChatLayoutState {
  FLOATING = 'floating',
  SIDEBAR = 'sidebar', 
  FULLPAGE = 'fullpage'
}

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface UserPreferences {
  defaultLayout: ChatLayoutState;
  rememberLayout: boolean;
  animations: boolean;
  autoResize: boolean;
}

export interface ChatUIState {
  layoutState: ChatLayoutState;
  isOpen: boolean;
  position: Position;
  size: Size;
  messages: Message[];
  isLoading: boolean;
  preferences: UserPreferences;
  isTransitioning: boolean;
}

export interface PersistedChatState {
  layoutState: ChatLayoutState;
  position: Position;
  size: Size;
  preferences: UserPreferences;
  sessionData: {
    messages: Message[];
    lastActive: Date;
    blueprintId: string;
  };
}

export interface StateTransitionError {
  fromState: ChatLayoutState;
  toState: ChatLayoutState;
  error: Error;
  fallbackState: ChatLayoutState;
  userMessage: string;
}

export interface BlueprintInfo {
  id: string;
  image: string;
  name: string;
  customerName: string;
  productName: string;
  material: string;
}