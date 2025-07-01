export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  isTyping?: boolean;
}

export interface AnnotationPoint {
  id: string;
  position: { x: number; y: number }; // 図面上の相対座標（0-1）
  screenPosition: { x: number; y: number }; // 画面座標
  context: SpatialContext;
  conversations: Message[];
  status: 'active' | 'resolved' | 'pending';
  createdAt: Date;
  lastActiveAt: Date;
}

export interface SpatialContext {
  nearbyElements: string[];
  dimensions?: { width: number; height: number };
  materials?: string[];
  relatedAnnotations: string[];
  importance: 'critical' | 'normal' | 'minor';
  description: string;
}

export interface ImmersiveModeState {
  isActive: boolean;
  activeAnnotation: string | null;
  backgroundOpacity: number;
  transitionState: 'entering' | 'active' | 'exiting' | 'idle';
}