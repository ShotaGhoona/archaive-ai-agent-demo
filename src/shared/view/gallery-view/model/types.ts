// 汎用的なギャラリービューの型定義

// グリッド設定
export interface GalleryLayoutConfig {
  // グリッド設定（カスタマイズ性優先）
  grid: {
    xs?: number;  // 1-12
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  
  // アスペクト比設定（カスタマイズ性優先）
  aspectRatio: 'video' | 'square' | '4/3' | 'auto' | string;
}

// アイテム設定
export interface GalleryItemConfig<T> {
  // サムネイル表示設定（カスタマイズ性優先）
  showThumbnail: boolean;
  getThumbnailUrl?: (item: T) => string;
  
  // サムネイル上のオーバーレイ（ホバー時のボタンなど）
  thumbnailOverlayRender?: (item: T) => React.ReactNode;
  
  // コンテンツレンダラー（TableViewのrenderと同じ思想）
  contentRender: (item: T) => React.ReactNode;
}

// 動作設定
export interface GalleryBehaviorConfig<T> {
  // リンク設定
  linkConfig?: {
    enabled: boolean;
    getHref: (item: T) => string;
    target?: '_blank' | '_self';
  };
  
  // 選択設定（将来拡張用）
  selectionConfig?: {
    enabled: boolean;
    multiple?: boolean;
    onSelect?: (items: T[]) => void;
  };
}

// 統合設定
export interface GalleryViewConfig<T> {
  layoutConfig: GalleryLayoutConfig;
  itemConfig: GalleryItemConfig<T>;
  behaviorConfig?: GalleryBehaviorConfig<T>;
  getRowId?: (item: T) => string;
  className?: string;
}

// メインProps（シンプル化）
export interface GalleryViewProps<T> {
  data: T[];
  config: GalleryViewConfig<T>;
  loading?: boolean;
}

// アスペクト比のユーティリティ型
export type AspectRatioClass = 
  | 'aspect-video'     // 16:9
  | 'aspect-square'    // 1:1
  | 'aspect-[4/3]'     // 4:3
  | 'aspect-auto'      // auto
  | string;            // カスタム

// グリッドクラスのユーティリティ型
export type GridClass = string;