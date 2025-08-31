import React from 'react';
import { UploadGalleryView, ProjectBoxList } from '../ui';
import { useBlueprintSorting, useDragAndDrop } from '../lib';
import { ViewMode, FileUploadData } from '../model';

interface BlueprintSortingPageProps {
  // 基本的なプロパティ（既存のページから引き継ぎ）
  viewMode: ViewMode;
  // その他必要なプロパティ
}

export function BlueprintSortingPage({ viewMode }: BlueprintSortingPageProps) {
  // 状態管理フック
  const {
    state,
    getUnassignedFiles,
    handleDropToNewProject,
    handleDropToProject,
    updateFiles,
    updateFileStacks,
    updateSelectedFiles,
    updateSelectedStacks,
    updateTrashedFiles,
  } = useBlueprintSorting();

  // ドラッグ&ドロップ管理フック
  const {
    dragOverTarget,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  } = useDragAndDrop();

  // 未割り当ての図面を取得（ギャラリーに表示）
  const unassignedFiles = getUnassignedFiles();

  // 一括登録処理
  const handleBatchRegister = () => {
    console.log('一括登録:', state.projects);
    // ここで実際の登録処理を行う
  };

  // その他のハンドラー（既存の機能から移行）
  const handleRemoveFile = (id: string) => {
    const fileToRemove = state.files.find((f) => f.id === id);
    if (fileToRemove) {
      updateFiles(state.files.filter((f) => f.id !== id));
      updateTrashedFiles([...state.trashedFiles, fileToRemove]);
    }
  };

  const handleRestoreFile = (id: string) => {
    const fileToRestore = state.trashedFiles.find((f) => f.id === id);
    if (fileToRestore) {
      updateTrashedFiles(state.trashedFiles.filter((f) => f.id !== id));
      updateFiles([...state.files, fileToRestore]);
    }
  };

  const handleToggleSelection = (id: string) => {
    const isSelected = state.selectedFiles.includes(id);
    if (isSelected) {
      updateSelectedFiles(
        state.selectedFiles.filter((fileId) => fileId !== id),
      );
    } else {
      updateSelectedFiles([...state.selectedFiles, id]);
    }
  };

  const handleToggleStackSelection = (stackId: string) => {
    const isSelected = state.selectedStacks.includes(stackId);
    if (isSelected) {
      updateSelectedStacks(state.selectedStacks.filter((id) => id !== stackId));
    } else {
      updateSelectedStacks([...state.selectedStacks, stackId]);
    }
  };

  const handleUnstackFiles = (stackId: string) => {
    const stack = state.fileStacks.find((s) => s.id === stackId);
    if (stack) {
      updateFiles([...state.files, ...stack.files]);
      updateFileStacks(state.fileStacks.filter((s) => s.id !== stackId));
    }
  };

  const handleRemoveStack = (stackId: string) => {
    const stack = state.fileStacks.find((s) => s.id === stackId);
    if (stack) {
      updateTrashedFiles([...state.trashedFiles, ...stack.files]);
      updateFileStacks(state.fileStacks.filter((s) => s.id !== stackId));
    }
  };

  const handleAddFiles = (files: FileUploadData[]) => {
    // ファイル追加処理の実装
    console.log('ファイル追加:', files);
  };

  return (
    <div className='flex h-full gap-6 p-6'>
      {/* 左側：図面ギャラリー（3/4） */}
      <div className='flex flex-1 flex-col'>
        <UploadGalleryView
          files={viewMode === 'uploaded' ? unassignedFiles : state.trashedFiles}
          fileStacks={viewMode === 'uploaded' ? state.fileStacks : []}
          selectedFiles={state.selectedFiles}
          selectedStacks={state.selectedStacks}
          viewMode={viewMode}
          onRemoveFile={handleRemoveFile}
          onRestoreFile={handleRestoreFile}
          onToggleSelection={handleToggleSelection}
          onToggleStackSelection={handleToggleStackSelection}
          onUnstackFiles={handleUnstackFiles}
          onRemoveStack={handleRemoveStack}
          onAddFiles={handleAddFiles}
          onDragStart={handleDragStart}
        />
      </div>

      {/* 右側：プロジェクトボックスリスト（1/4） */}
      <div className='w-80 flex-shrink-0'>
        <ProjectBoxList
          projects={state.projects}
          onBatchRegister={handleBatchRegister}
          onDropToNewProject={handleDropToNewProject}
          onDropToProject={handleDropToProject}
          dragOverTarget={dragOverTarget}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        />
      </div>
    </div>
  );
}
