import { BlueprintDetailDataInterface } from '@/dummy-data-er-fix/blueprint/interfaces/types';

export interface SimilarDetailContainerProps {
  // 初期表示用の図面ID（オプション）
  initialBlueprintId?: number;
}

export interface TargetBlueprintData {
  // 対象図面データ
  blueprint: BlueprintDetailDataInterface | null;
  // アップロードされた図面かどうか
  isUploaded: boolean;
}

export interface SimilarDetailHeaderProps {
  // フィルタートグルボタンのハンドラ
  onToggleFilterSidebar: () => void;
  // サイドバーの開閉状態
  isFilterSidebarOpen: boolean;
  // 検索ボックスの値（オプション）
  searchTerm?: string;
  // 検索ボックスの変更ハンドラ（オプション）
  onSearchChange?: (value: string) => void;
}

export interface TargetBlueprintPanelProps {
  // 対象図面データ
  targetBlueprint: TargetBlueprintData;
}
