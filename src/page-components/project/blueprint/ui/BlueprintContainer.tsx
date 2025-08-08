"use client";
import { useState, useEffect } from "react";
import { DetailSidebar } from "./DetailSidebar";
import { BlueprintViewer } from "./BlueprintViewer";
import { BlueprintUtilities } from "./BlueprintUtilities";
import { useResizablePanel } from "../lib/useResizablePanel";
import blueprintsData from "../data/blueprints.json";
import { BlueprintFile, BasicInformation as BasicInfo, EstimateInformation as EstimateInfo } from "../data/types";

export default function BlueprintContainer() {
  const [blueprintFiles, setBlueprintFiles] = useState<BlueprintFile[]>(blueprintsData);
  const [activeFile, setActiveFile] = useState<BlueprintFile | null>(null);
  
  // リサイザブルパネルのフック
  const {
    panelWidth,
    centerWidth,
    isDragging,
    resizableAreaRef,
    handleMouseDown
  } = useResizablePanel();

  // 初期アクティブファイルを設定
  useEffect(() => {
    const activeBlueprint = blueprintFiles.find(file => file.isActive);
    if (activeBlueprint) {
      setActiveFile(activeBlueprint);
    }
  }, [blueprintFiles]);

  // ファイル選択ハンドラー
  const handleFileSelect = (fileId: string) => {
    const selectedFile = blueprintFiles.find(file => file.id === fileId);
    if (selectedFile) {
      setBlueprintFiles(prev => prev.map(file => ({
        ...file,
        isActive: file.id === fileId
      })));
      setActiveFile(selectedFile);
    }
  };

  // ファイル削除ハンドラー
  const handleFileRemove = (fileId: string) => {
    setBlueprintFiles(prev => {
      const newFiles = prev.filter(file => file.id !== fileId);
      // 削除されたファイルがアクティブだった場合、新しいアクティブファイルを設定
      if (activeFile?.id === fileId) {
        const newActiveFile = newFiles.length > 0 ? newFiles[0] : null;
        setActiveFile(newActiveFile);
        if (newActiveFile) {
          return newFiles.map(file => ({
            ...file,
            isActive: file.id === newActiveFile.id
          }));
        }
      }
      return newFiles;
    });
  };

  // ファイル追加ハンドラー
  const handleFileAdd = (newFile: BlueprintFile) => {
    setBlueprintFiles(prev => [...prev, newFile]);
  };

  // 基本情報保存ハンドラー
  const handleBasicSave = (basicData: Partial<BasicInfo>) => {
    if (activeFile) {
      setBlueprintFiles(prev => prev.map(file => 
        file.id === activeFile.id 
          ? { ...file, basicInformation: { ...(file.basicInformation || {}), ...basicData } }
          : file
      ));
      setActiveFile(prev => prev ? { ...prev, basicInformation: { ...(prev.basicInformation || {}), ...basicData } } : null);
    }
  };

  // 見積もり情報保存ハンドラー
  const handleEstimateSave = (estimateData: Partial<EstimateInfo>) => {
    if (activeFile) {
      setBlueprintFiles(prev => prev.map(file => 
        file.id === activeFile.id 
          ? { ...file, estimateInformation: { ...(file.estimateInformation || {}), ...estimateData } }
          : file
      ));
      setActiveFile(prev => prev ? { ...prev, estimateInformation: { ...(prev.estimateInformation || {}), ...estimateData } } : null);
    }
  };

  return (
    <div className="flex-1 flex overflow-hidden min-h-0">
      {/* 左サイドバー */}
      <DetailSidebar 
        files={blueprintFiles}
        onFileSelect={handleFileSelect}
        onFileRemove={handleFileRemove}
        onFileAdd={handleFileAdd}
      />
      
      {/* 中央・右側エリア */}
      <div className="flex-1 flex overflow-hidden min-h-0" ref={resizableAreaRef}>
        {/* 中央コンテンツエリア */}
        <div 
          className="overflow-hidden" 
          style={{ width: `${centerWidth}%` }}
        >
          <BlueprintViewer 
            activeFile={activeFile} 
          />
        </div>
        
        {/* リサイズハンドル */}
        <div
          className={`w-1 bg-gray-200 hover:bg-gray-300 cursor-col-resize flex items-center justify-center transition-colors ${
            isDragging ? 'bg-gray-300' : ''
          }`}
          onMouseDown={handleMouseDown}
        >
          <div className="w-0.5 h-8 bg-gray-400 rounded-full" />
        </div>
        
        {/* 右側パネル */}
        <div 
          className="border-l overflow-hidden" 
          style={{ width: `${panelWidth}%` }}
        >
          <BlueprintUtilities
            activeFile={activeFile}
            onBasicSave={handleBasicSave}
            onEstimateSave={handleEstimateSave}
          />
        </div>
      </div>
    </div>
  );
}