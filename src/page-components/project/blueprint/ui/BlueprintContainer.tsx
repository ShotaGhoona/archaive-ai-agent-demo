"use client";
import { useState, useEffect } from "react";
import { DetailSidebar } from "./DetailSidebar";
import { BlueprintViewer } from "./BlueprintViewer";
import { BlueprintInfo } from "./BlueprintInfo";
import blueprintsData from "../data/blueprints.json";
import { SimilarBlueprintsContent } from "./SimilarBlueprintsContent";
import { BlueprintFile } from "../data/types";

export default function BlueprintContainer() {
  const [blueprintFiles, setBlueprintFiles] = useState<BlueprintFile[]>(blueprintsData);
  const [activeFile, setActiveFile] = useState<BlueprintFile | null>(null);

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

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* 左サイドバー */}
      <DetailSidebar 
        files={blueprintFiles}
        onFileSelect={handleFileSelect}
        onFileRemove={handleFileRemove}
        onFileAdd={handleFileAdd}
      />
      
      {/* 中央・右側エリア（Grid 2:1） */}
      <div className="flex-1 grid grid-cols-6 overflow-hidden">
        {/* 中央コンテンツエリア（2/3） */}
        <div className="col-span-4 flex flex-col">
          {/* BlueprintViewer（上部） */}
          <div className="flex-1 min-h-0">
            <BlueprintViewer 
              activeFile={activeFile} 
            />
          </div>
          
          {/* BlueprintInfo（トグルボタン付き） */}
          <BlueprintInfo 
            activeFile={activeFile}
          />
        </div>
        
        {/* 右側パネル（1/3） */}
        <div className="col-span-2 border-l">
          <SimilarBlueprintsContent
            activeFile={activeFile}
          />
        </div>
      </div>
    </div>
  );
}