'use client';
import React, { useState } from 'react';
import { UploadPageHeader } from '../ui';
import { UploadGalleryView } from '../ui';
import { ProjectBoxList } from '../ui';
import { UploadedFile, FileStack, ViewMode, FileUploadData } from '../model';
import {
  FileOperations,
  StackOperations,
  useBlueprintSorting,
  useDragAndDrop,
} from '../lib';

export function BlueprintUploadContainer() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [trashedFiles, setTrashedFiles] = useState<UploadedFile[]>([]);
  const [fileStacks, setFileStacks] = useState<FileStack[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [selectedStacks, setSelectedStacks] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('uploaded');

  // ドラッグ&ドロップ機能のフック
  const blueprintSorting = useBlueprintSorting();
  const dragAndDrop = useDragAndDrop();

  // 既存の状態とblueprintSortingフックの状態を同期
  React.useEffect(() => {
    blueprintSorting.updateFiles(uploadedFiles);
    blueprintSorting.updateFileStacks(fileStacks);
    blueprintSorting.updateSelectedFiles(selectedFiles);
    blueprintSorting.updateSelectedStacks(selectedStacks);
    blueprintSorting.updateTrashedFiles(trashedFiles);
  }, [uploadedFiles, fileStacks, selectedFiles, selectedStacks, trashedFiles]);

  const handleAddFiles = (newFiles: FileUploadData[]) => {
    const updatedFiles = FileOperations.addFiles(uploadedFiles, newFiles);
    setUploadedFiles(updatedFiles);
  };

  const handleRemoveFile = (id: string) => {
    const result = FileOperations.removeFile(
      uploadedFiles,
      trashedFiles,
      selectedFiles,
      id,
    );
    setUploadedFiles(result.updatedFiles);
    setTrashedFiles(result.updatedTrashed);
    setSelectedFiles(result.updatedSelected);
  };

  const handleRemoveSelected = () => {
    if (viewMode === 'uploaded') {
      const result = FileOperations.removeSelectedFiles(
        uploadedFiles,
        trashedFiles,
        fileStacks,
        selectedFiles,
        selectedStacks,
      );
      setUploadedFiles(result.updatedFiles);
      setTrashedFiles(result.updatedTrashed);
      setFileStacks(result.updatedStacks);
      setSelectedFiles([]);
      setSelectedStacks([]);
    } else {
      const updatedTrashed = FileOperations.permanentlyDeleteFiles(
        trashedFiles,
        selectedFiles,
      );
      setTrashedFiles(updatedTrashed);
      setSelectedFiles([]);
    }
  };

  const handleRestoreFile = (id: string) => {
    const result = FileOperations.restoreFile(
      uploadedFiles,
      trashedFiles,
      selectedFiles,
      id,
    );
    setUploadedFiles(result.updatedFiles);
    setTrashedFiles(result.updatedTrashed);
    setSelectedFiles(result.updatedSelected);
  };

  const handleRestoreSelected = () => {
    const result = FileOperations.restoreSelectedFiles(
      uploadedFiles,
      trashedFiles,
      selectedFiles,
    );
    setUploadedFiles(result.updatedFiles);
    setTrashedFiles(result.updatedTrashed);
    setSelectedFiles([]);
  };

  const handleSelectAll = () => {
    const result = FileOperations.selectAllItems(
      uploadedFiles,
      trashedFiles,
      fileStacks,
      viewMode,
    );
    setSelectedFiles(result.selectedFiles);
    setSelectedStacks(result.selectedStacks);
  };

  const handleDeselectAll = () => {
    setSelectedFiles([]);
    setSelectedStacks([]);
  };

  const handleToggleSelection = (id: string) => {
    const updatedSelected = FileOperations.toggleSelection(selectedFiles, id);
    setSelectedFiles(updatedSelected);
  };

  const handleToggleStackSelection = (stackId: string) => {
    const updatedSelected = StackOperations.toggleStackSelection(
      selectedStacks,
      stackId,
    );
    setSelectedStacks(updatedSelected);
  };

  const handleStackFiles = () => {
    const result = StackOperations.createStackFromSelection(
      uploadedFiles,
      fileStacks,
      selectedFiles,
      selectedStacks,
    );
    setUploadedFiles(result.updatedFiles);
    setFileStacks(result.updatedStacks);
    setSelectedFiles([]);
    setSelectedStacks([]);
  };

  const handleUnstackFiles = (stackId: string) => {
    const result = StackOperations.unstackFiles(
      uploadedFiles,
      fileStacks,
      selectedStacks,
      stackId,
    );
    setUploadedFiles(result.updatedFiles);
    setFileStacks(result.updatedStacks);
    setSelectedStacks(result.updatedSelectedStacks);
  };

  const handleRemoveStack = (stackId: string) => {
    const result = StackOperations.removeStack(
      fileStacks,
      trashedFiles,
      selectedStacks,
      stackId,
    );
    setFileStacks(result.updatedStacks);
    setTrashedFiles(result.updatedTrashed);
    setSelectedStacks(result.updatedSelectedStacks);
  };

  // 未割り当ての図面を取得（案件に移動済みの図面は表示しない）
  const unassignedFiles = blueprintSorting.getUnassignedFiles();
  const currentFiles = viewMode === 'uploaded' ? unassignedFiles : trashedFiles;

  return (
    <div className='flex h-[calc(100vh-45px)] overflow-hidden'>
      {/* 左側：図面ギャラリーエリア */}
      <div className='flex flex-1 flex-col overflow-hidden'>
        {/* 左側ヘッダー */}
        <div className='flex-shrink-0 p-4'>
          <UploadPageHeader
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            selectedFiles={selectedFiles}
            selectedStacks={selectedStacks}
            onSelectAll={handleSelectAll}
            onDeselectAll={handleDeselectAll}
            onRemoveSelected={handleRemoveSelected}
            onRestoreSelected={handleRestoreSelected}
            onAddFiles={handleAddFiles}
            onStackFiles={handleStackFiles}
            uploadedFilesCount={uploadedFiles.length}
            trashedFilesCount={trashedFiles.length}
            stacksCount={fileStacks.length}
          />
        </div>

        {/* 図面ギャラリー */}
        <div className='flex min-h-0 flex-1 flex-col px-4'>
          <UploadGalleryView
            files={currentFiles}
            fileStacks={
              viewMode === 'uploaded' ? blueprintSorting.state.fileStacks : []
            }
            selectedFiles={selectedFiles}
            selectedStacks={selectedStacks}
            viewMode={viewMode}
            onRemoveFile={handleRemoveFile}
            onRestoreFile={handleRestoreFile}
            onToggleSelection={handleToggleSelection}
            onToggleStackSelection={handleToggleStackSelection}
            onUnstackFiles={handleUnstackFiles}
            onRemoveStack={handleRemoveStack}
            onAddFiles={handleAddFiles}
            onDragStart={dragAndDrop.handleDragStart}
          />
        </div>
      </div>

      {/* 右側：案件ボックスエリア */}
      <div className='flex h-full w-1/4 min-w-[280px] flex-col border-l bg-gray-50 p-4'>
        <ProjectBoxList
          projects={blueprintSorting.state.projects}
          onBatchRegister={() => console.log('一括登録')}
          onDropToNewProject={blueprintSorting.handleDropToNewProject}
          onDropToProject={blueprintSorting.handleDropToProject}
          dragOverTarget={dragAndDrop.dragOverTarget}
          onDragOver={dragAndDrop.handleDragOver}
          onDragLeave={dragAndDrop.handleDragLeave}
          onDrop={dragAndDrop.handleDrop}
        />
      </div>
    </div>
  );
}
