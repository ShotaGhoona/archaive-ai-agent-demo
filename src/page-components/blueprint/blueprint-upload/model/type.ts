// Blueprint Upload types

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  createdAt: Date;
}

export interface FileStack {
  id: string;
  files: UploadedFile[];
  createdAt: Date;
}

export interface Project {
  id: string;
  name: string;
  fileCount: number;
  files?: UploadedFile[];
  createdAt?: Date;
}

// 図面とプロジェクトの関係を管理する型
export interface ProjectAssignment {
  fileId: string;
  projectId: string;
  assignedAt: Date;
}

// 図面一括仕分け機能のメイン状態管理型
export interface BlueprintSortingState {
  files: UploadedFile[];
  fileStacks: FileStack[];
  projects: Project[];
  assignments: ProjectAssignment[];
  selectedFiles: string[];
  selectedStacks: string[];
  trashedFiles: UploadedFile[];
}

// ドラッグ&ドロップのアイテム型
export interface DragItem {
  type: 'file' | 'stack';
  id: string;
  files: UploadedFile[]; // fileの場合は単一要素、stackの場合は複数要素
}

export type ViewMode = "uploaded" | "trash";

export type FileUploadData = Omit<UploadedFile, 'id' | 'createdAt'>;

// Component Props
export interface UploadPageHeaderProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  selectedFiles: string[];
  selectedStacks: string[];
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onRemoveSelected: () => void;
  onRestoreSelected: () => void;
  onAddFiles: (files: FileUploadData[]) => void;
  onStackFiles: () => void;
  uploadedFilesCount: number;
  trashedFilesCount: number;
  stacksCount: number;
}

export interface UploadGalleryViewProps {
  files: UploadedFile[];
  fileStacks: FileStack[];
  selectedFiles: string[];
  selectedStacks: string[];
  viewMode: ViewMode;
  onRemoveFile: (id: string) => void;
  onRestoreFile: (id: string) => void;
  onToggleSelection: (id: string) => void;
  onToggleStackSelection: (stackId: string) => void;
  onUnstackFiles: (stackId: string) => void;
  onRemoveStack: (stackId: string) => void;
  onAddFiles: (files: FileUploadData[]) => void;
  onDragStart?: (item: DragItem) => void;
}

export interface AddFileCardProps {
  onAddFiles: (files: FileUploadData[]) => void;
}

export interface StackedCardProps {
  stackedFiles: UploadedFile[];
  isSelected: boolean;
  onToggleSelection: () => void;
  onUnstackFiles: () => void;
  onRemoveStack: () => void;
  onDragStart?: (item: DragItem) => void;
  stackId: string;
}

export interface ProjectBoxListProps {
  projects?: Project[];
  onBatchRegister?: () => void;
  onDropToNewProject?: (item: DragItem) => void;
  onDropToProject?: (item: DragItem, projectId: string) => void;
  dragOverTarget?: string | null;
  onDragOver?: (e: React.DragEvent, targetId?: string) => void;
  onDragLeave?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent, onDropToNewProject?: (item: DragItem) => void, onDropToProject?: (item: DragItem, projectId: string) => void, targetProjectId?: string) => void;
}