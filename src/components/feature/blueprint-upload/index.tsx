"use client";
import { useState, useEffect } from "react";
import { UploadPageHeader } from "./components/UploadPageHeader";
import { UploadGalleryView } from "./components/UploadGalleryView";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  createdAt: Date;
}

interface FileStack {
  id: string;
  files: UploadedFile[];
  createdAt: Date;
}

export function BlueprintUploadPage() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [trashedFiles, setTrashedFiles] = useState<UploadedFile[]>([]);
  const [fileStacks, setFileStacks] = useState<FileStack[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [selectedStacks, setSelectedStacks] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"uploaded" | "trash">("uploaded");

  useEffect(() => {
    // SessionStorageからファイル情報を取得
    const storedFiles = sessionStorage.getItem('uploadedFiles');
    const storedTrashedFiles = sessionStorage.getItem('trashedFiles');
    const storedFileStacks = sessionStorage.getItem('fileStacks');
    
    if (storedFiles) {
      const files = JSON.parse(storedFiles);
      setUploadedFiles(files.map((file: any) => ({
        ...file,
        createdAt: new Date(file.createdAt)
      })));
    }
    if (storedTrashedFiles) {
      const files = JSON.parse(storedTrashedFiles);
      setTrashedFiles(files.map((file: any) => ({
        ...file,
        createdAt: new Date(file.createdAt)
      })));
    }
    if (storedFileStacks) {
      const stacks = JSON.parse(storedFileStacks);
      setFileStacks(stacks.map((stack: any) => ({
        ...stack,
        createdAt: new Date(stack.createdAt),
        files: stack.files.map((file: any) => ({
          ...file,
          createdAt: new Date(file.createdAt)
        }))
      })));
    }
  }, []);

  const handleAddFiles = (newFiles: Omit<UploadedFile, 'id' | 'createdAt'>[]) => {
    const filesWithId = newFiles.map(file => ({
      ...file,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      createdAt: new Date()
    }));
    
    const updatedFiles = [...uploadedFiles, ...filesWithId];
    setUploadedFiles(updatedFiles);
    sessionStorage.setItem('uploadedFiles', JSON.stringify(updatedFiles));
  };

  const handleRemoveFile = (id: string) => {
    const fileToRemove = uploadedFiles.find(f => f.id === id);
    if (fileToRemove) {
      const updatedFiles = uploadedFiles.filter(f => f.id !== id);
      const updatedTrashedFiles = [...trashedFiles, fileToRemove];
      
      setUploadedFiles(updatedFiles);
      setTrashedFiles(updatedTrashedFiles);
      setSelectedFiles(prev => prev.filter(fId => fId !== id));
      
      sessionStorage.setItem('uploadedFiles', JSON.stringify(updatedFiles));
      sessionStorage.setItem('trashedFiles', JSON.stringify(updatedTrashedFiles));
    }
  };

  const handleRemoveSelected = () => {
    if (viewMode === "uploaded") {
      // 選択された個別ファイルを削除
      const filesToRemove = uploadedFiles.filter(f => selectedFiles.includes(f.id));
      const remainingFiles = uploadedFiles.filter(f => !selectedFiles.includes(f.id));
      
      // 選択されたスタックからファイルを取り出して削除
      const stacksToRemove = fileStacks.filter(s => selectedStacks.includes(s.id));
      const stackFilesToRemove = stacksToRemove.flatMap(s => s.files);
      const remainingStacks = fileStacks.filter(s => !selectedStacks.includes(s.id));
      
      // 全ての削除対象ファイルをゴミ箱に移動
      const allFilesToRemove = [...filesToRemove, ...stackFilesToRemove];
      const updatedTrashedFiles = [...trashedFiles, ...allFilesToRemove];
      
      setUploadedFiles(remainingFiles);
      setFileStacks(remainingStacks);
      setTrashedFiles(updatedTrashedFiles);
      setSelectedFiles([]);
      setSelectedStacks([]);
      
      sessionStorage.setItem('uploadedFiles', JSON.stringify(remainingFiles));
      sessionStorage.setItem('fileStacks', JSON.stringify(remainingStacks));
      sessionStorage.setItem('trashedFiles', JSON.stringify(updatedTrashedFiles));
    } else {
      // ゴミ箱モードでは個別ファイルのみ削除（従来の処理）
      const filesToRemove = trashedFiles.filter(f => selectedFiles.includes(f.id));
      const remainingTrashedFiles = trashedFiles.filter(f => !selectedFiles.includes(f.id));
      
      setTrashedFiles(remainingTrashedFiles);
      setSelectedFiles([]);
      
      sessionStorage.setItem('trashedFiles', JSON.stringify(remainingTrashedFiles));
    }
  };

  const handleRestoreFile = (id: string) => {
    const fileToRestore = trashedFiles.find(f => f.id === id);
    if (fileToRestore) {
      const updatedTrashedFiles = trashedFiles.filter(f => f.id !== id);
      const updatedFiles = [...uploadedFiles, fileToRestore];
      
      setTrashedFiles(updatedTrashedFiles);
      setUploadedFiles(updatedFiles);
      setSelectedFiles(prev => prev.filter(fId => fId !== id));
      
      sessionStorage.setItem('uploadedFiles', JSON.stringify(updatedFiles));
      sessionStorage.setItem('trashedFiles', JSON.stringify(updatedTrashedFiles));
    }
  };

  const handleRestoreSelected = () => {
    const filesToRestore = trashedFiles.filter(f => selectedFiles.includes(f.id));
    const remainingTrashedFiles = trashedFiles.filter(f => !selectedFiles.includes(f.id));
    const updatedFiles = [...uploadedFiles, ...filesToRestore];
    
    setTrashedFiles(remainingTrashedFiles);
    setUploadedFiles(updatedFiles);
    setSelectedFiles([]);
    
    sessionStorage.setItem('uploadedFiles', JSON.stringify(updatedFiles));
    sessionStorage.setItem('trashedFiles', JSON.stringify(remainingTrashedFiles));
  };

  const handleSelectAll = () => {
    if (viewMode === "uploaded") {
      // アップロードモードでは個別ファイルとスタック両方を選択
      setSelectedFiles(uploadedFiles.map(f => f.id));
      setSelectedStacks(fileStacks.map(s => s.id));
    } else {
      // ゴミ箱モードでは個別ファイルのみ
      const currentFiles = trashedFiles;
      setSelectedFiles(currentFiles.map(f => f.id));
    }
  };

  const handleDeselectAll = () => {
    setSelectedFiles([]);
    setSelectedStacks([]);
  };

  const handleToggleSelection = (id: string) => {
    setSelectedFiles(prev => 
      prev.includes(id) 
        ? prev.filter(fId => fId !== id)
        : [...prev, id]
    );
  };

  const handleToggleStackSelection = (stackId: string) => {
    setSelectedStacks(prev => 
      prev.includes(stackId) 
        ? prev.filter(sId => sId !== stackId)
        : [...prev, stackId]
    );
  };

  const handleStackFiles = () => {
    const totalSelectedItems = selectedFiles.length + selectedStacks.length;
    if (totalSelectedItems < 2) return;
    
    // 選択された個別ファイルを取得
    const selectedIndividualFiles = uploadedFiles.filter(f => selectedFiles.includes(f.id));
    
    // 選択されたスタックからファイルを取得
    const selectedStackFiles = fileStacks
      .filter(s => selectedStacks.includes(s.id))
      .flatMap(s => s.files);
    
    // 全てのファイルを統合
    const allFilesToStack = [...selectedIndividualFiles, ...selectedStackFiles];
    
    // 新しいスタックを作成
    const newStack: FileStack = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      files: allFilesToStack.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime()), // 作成日時順でソート
      createdAt: new Date()
    };
    
    // 選択された個別ファイルを削除
    const remainingFiles = uploadedFiles.filter(f => !selectedFiles.includes(f.id));
    
    // 選択されたスタックを削除し、新しいスタックを追加
    const remainingStacks = fileStacks.filter(s => !selectedStacks.includes(s.id));
    const updatedStacks = [...remainingStacks, newStack];
    
    // 状態を更新
    setFileStacks(updatedStacks);
    setUploadedFiles(remainingFiles);
    setSelectedFiles([]);
    setSelectedStacks([]);
    
    // セッションストレージに保存
    sessionStorage.setItem('uploadedFiles', JSON.stringify(remainingFiles));
    sessionStorage.setItem('fileStacks', JSON.stringify(updatedStacks));
  };

  const handleUnstackFiles = (stackId: string) => {
    const stackToUnstack = fileStacks.find(s => s.id === stackId);
    if (!stackToUnstack) return;
    
    const remainingStacks = fileStacks.filter(s => s.id !== stackId);
    const updatedFiles = [...uploadedFiles, ...stackToUnstack.files];
    
    setFileStacks(remainingStacks);
    setUploadedFiles(updatedFiles);
    setSelectedStacks(prev => prev.filter(sId => sId !== stackId));
    
    sessionStorage.setItem('uploadedFiles', JSON.stringify(updatedFiles));
    sessionStorage.setItem('fileStacks', JSON.stringify(remainingStacks));
  };

  const handleRemoveStack = (stackId: string) => {
    const stackToRemove = fileStacks.find(s => s.id === stackId);
    if (!stackToRemove) return;
    
    const remainingStacks = fileStacks.filter(s => s.id !== stackId);
    const updatedTrashedFiles = [...trashedFiles, ...stackToRemove.files];
    
    setFileStacks(remainingStacks);
    setTrashedFiles(updatedTrashedFiles);
    setSelectedStacks(prev => prev.filter(sId => sId !== stackId));
    
    sessionStorage.setItem('fileStacks', JSON.stringify(remainingStacks));
    sessionStorage.setItem('trashedFiles', JSON.stringify(updatedTrashedFiles));
  };

  const currentFiles = viewMode === "uploaded" ? uploadedFiles : trashedFiles;

  return (
    <div className="h-[calc(100vh-45px)] flex flex-col overflow-hidden">
      {/* ページヘッダー */}
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
      
      {/* ギャラリービュー */}
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
  );
}