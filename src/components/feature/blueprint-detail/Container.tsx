"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DetailTabNavigation } from "./components/DetailTabNavigation";
import { DetailSidebar } from "./components/DetailSidebar";
import { BlueprintViewer } from "./components/BlueprintViewer";
import { BlueprintInfoPanel } from "./components/BlueprintInfoPanel";
import blueprintsData from "./data/blueprints.json";

interface BlueprintFile {
  id: string;
  name: string;
  description: string;
  size: number;
  type: string;
  imageUrl: string;
  createdAt: string;
  isActive?: boolean;
}

export default function BlueprintDetail() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("blueprint");
  const [blueprintFiles, setBlueprintFiles] = useState<BlueprintFile[]>(blueprintsData);
  const [activeFile, setActiveFile] = useState<BlueprintFile | null>(null);

  // URLパラメータからタブを取得
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // 初期アクティブファイルを設定
  useEffect(() => {
    const activeBlueprint = blueprintFiles.find(file => file.isActive);
    if (activeBlueprint && activeTab === "blueprint") {
      setActiveFile(activeBlueprint);
    } else if (activeTab !== "blueprint") {
      setActiveFile(null);
    }
  }, [blueprintFiles, activeTab]);

  // タブ切り替え時にURLを更新
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    const newUrl = `${window.location.pathname}?tab=${tabId}`;
    router.push(newUrl, { scroll: false });
  };

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
    <div className="h-[calc(100vh-45px)] flex flex-col overflow-hidden">
      {/* ページヘッダー */}
      <div className="flex-shrink-0 p-4 border-b bg-white">
        <div className="flex items-center justify-between">
          <DetailTabNavigation 
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
          
        </div>
      </div>

      {/* メインコンテンツエリア */}
      <div className="flex-1 flex overflow-hidden">
        {/* 左サイドバー */}
        <DetailSidebar 
          activeTab={activeTab}
          files={blueprintFiles}
          onFileSelect={handleFileSelect}
          onFileRemove={handleFileRemove}
          onFileAdd={handleFileAdd}
        />
        
        {/* 中央コンテンツエリア */}
        {activeTab === "blueprint" ? (
          <BlueprintViewer activeFile={activeFile} />
        ) : (
          <div className="flex-1 bg-gray-50 flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="text-6xl text-gray-300">📋</div>
              <div className="space-y-2">
                <h3 className="text-xl font-medium text-gray-500">
                  {`${activeTab}表示エリア`}
                </h3>
                <p className="text-sm text-gray-400">
                  コンテンツがここに表示されます
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* 右側情報パネル */}
        {activeTab === "blueprint" && (
          <BlueprintInfoPanel activeFile={activeFile} />
        )}
        
      </div>
    </div>
  );
}