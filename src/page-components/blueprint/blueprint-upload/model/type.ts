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
}

export interface ProjectBoxListProps {
  projects?: Project[];
  onBatchRegister?: () => void;
}