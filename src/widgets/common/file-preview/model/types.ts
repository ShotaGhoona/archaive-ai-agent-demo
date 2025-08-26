import { ReactNode } from 'react';

// 汎用的なプレビュー可能ファイル型
export interface PreviewableFile {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  metadata?: Record<string, unknown>;
}

// プレビューオプション
export interface PreviewOptions {
  initialZoom?: number;
  enableDownload?: boolean;
  enableRotation?: boolean;
  enableFullscreen?: boolean;
  customActions?: PreviewAction[];
  maxZoom?: number;
  minZoom?: number;
}

// カスタムアクション定義
export interface PreviewAction {
  id: string;
  label: string;
  icon: ReactNode;
  onClick: (file: PreviewableFile) => void;
  disabled?: boolean;
  variant?: 'default' | 'outline' | 'destructive';
}

// プレビュープロバイダーインターフェース
export interface PreviewProvider {
  id: string;
  name: string;
  supportedTypes: string[];
  supportedExtensions: string[];
  canPreview: (file: PreviewableFile) => boolean;
  render: (file: PreviewableFile, options: PreviewRenderOptions) => ReactNode;
  priority: number; // 複数プロバイダーが対応している場合の優先度
}

// プレビューレンダーオプション
export interface PreviewRenderOptions {
  zoom: number;
  rotation: number;
  onZoomChange: (zoom: number) => void;
  onRotationChange: (rotation: number) => void;
  className?: string;
}

// プレビューモーダルの状態
export interface PreviewModalState {
  isOpen: boolean;
  files: PreviewableFile[];
  currentIndex: number;
  zoom: number;
  rotation: number;
}

// プレビューモーダルのProps
export interface FilePreviewModalProps {
  files: PreviewableFile[];
  isOpen: boolean;
  onClose: () => void;
  initialFileIndex?: number;
  options?: PreviewOptions;
}

// ファイル形式判定結果
export interface FileTypeInfo {
  category: 'image' | 'document' | 'cad' | 'video' | 'audio' | 'unknown';
  extension: string;
  mimeType: string;
  isPreviewable: boolean;
}