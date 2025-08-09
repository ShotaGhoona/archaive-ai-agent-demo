"use client";
import { useState } from "react";
import { UploadPageHeader } from "./UploadPageHeader";
import { UploadGalleryView } from "./UploadGalleryView";
import { ProjectBoxList } from "./ProjectBoxList";
import { UploadedFile, FileStack, ViewMode, FileUploadData } from "../model/type";
import { FileOperations } from "../lib/fileOperations";
import { StackOperations } from "../lib/stackOperations";

export function BlueprintUploadContainer() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [trashedFiles, setTrashedFiles] = useState<UploadedFile[]>([]);
  const [fileStacks, setFileStacks] = useState<FileStack[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [selectedStacks, setSelectedStacks] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>("uploaded");


  const handleAddFiles = (newFiles: FileUploadData[]) => {
    const updatedFiles = FileOperations.addFiles(uploadedFiles, newFiles);
    setUploadedFiles(updatedFiles);
  };

  const handleRemoveFile = (id: string) => {
    const result = FileOperations.removeFile(uploadedFiles, trashedFiles, selectedFiles, id);
    setUploadedFiles(result.updatedFiles);
    setTrashedFiles(result.updatedTrashed);
    setSelectedFiles(result.updatedSelected);
  };

  const handleRemoveSelected = () => {
    if (viewMode === "uploaded") {
      const result = FileOperations.removeSelectedFiles(
        uploadedFiles,
        trashedFiles,
        fileStacks,
        selectedFiles,
        selectedStacks
      );
      setUploadedFiles(result.updatedFiles);
      setTrashedFiles(result.updatedTrashed);
      setFileStacks(result.updatedStacks);
      setSelectedFiles([]);
      setSelectedStacks([]);
    } else {
      const updatedTrashed = FileOperations.permanentlyDeleteFiles(trashedFiles, selectedFiles);
      setTrashedFiles(updatedTrashed);
      setSelectedFiles([]);
    }
  };

  const handleRestoreFile = (id: string) => {
    const result = FileOperations.restoreFile(uploadedFiles, trashedFiles, selectedFiles, id);
    setUploadedFiles(result.updatedFiles);
    setTrashedFiles(result.updatedTrashed);
    setSelectedFiles(result.updatedSelected);
  };

  const handleRestoreSelected = () => {
    const result = FileOperations.restoreSelectedFiles(uploadedFiles, trashedFiles, selectedFiles);
    setUploadedFiles(result.updatedFiles);
    setTrashedFiles(result.updatedTrashed);
    setSelectedFiles([]);
  };

  const handleSelectAll = () => {
    const result = FileOperations.selectAllItems(uploadedFiles, trashedFiles, fileStacks, viewMode);
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
    const updatedSelected = StackOperations.toggleStackSelection(selectedStacks, stackId);
    setSelectedStacks(updatedSelected);
  };

  const handleStackFiles = () => {
    const result = StackOperations.createStackFromSelection(
      uploadedFiles,
      fileStacks,
      selectedFiles,
      selectedStacks
    );
    setUploadedFiles(result.updatedFiles);
    setFileStacks(result.updatedStacks);
    setSelectedFiles([]);
    setSelectedStacks([]);
  };

  const handleUnstackFiles = (stackId: string) => {
    const result = StackOperations.unstackFiles(uploadedFiles, fileStacks, selectedStacks, stackId);
    setUploadedFiles(result.updatedFiles);
    setFileStacks(result.updatedStacks);
    setSelectedStacks(result.updatedSelectedStacks);
  };

  const handleRemoveStack = (stackId: string) => {
    const result = StackOperations.removeStack(fileStacks, trashedFiles, selectedStacks, stackId);
    setFileStacks(result.updatedStacks);
    setTrashedFiles(result.updatedTrashed);
    setSelectedStacks(result.updatedSelectedStacks);
  };

  const currentFiles = viewMode === "uploaded" ? uploadedFiles : trashedFiles;

  // デモ用のプロジェクトデータ
  const demoProjects = [
    { id: "1", name: "案件 1", fileCount: 5 },
    { id: "2", name: "案件 2", fileCount: 3 },
    { id: "3", name: "案件 3", fileCount: 8 }
  ];

  return (
    <div className="h-[calc(100vh-45px)] flex overflow-hidden">
      {/* 左側：図面ギャラリーエリア */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 左側ヘッダー */}
        <div className="flex-shrink-0 p-4">
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
        <div className="flex-1 flex flex-col min-h-0 px-4">
          <UploadGalleryView 
            files={currentFiles}
            fileStacks={viewMode === "uploaded" ? fileStacks : []}
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
          />
        </div>
      </div>
      
      {/* 右側：案件ボックスエリア */}
      <div className="w-1/4 min-w-[280px] h-full flex flex-col p-4 border-l bg-gray-50">
        <ProjectBoxList 
          projects={demoProjects}
          onBatchRegister={() => console.log("一括登録")}
        />
      </div>
    </div>
  );
}