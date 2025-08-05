"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DetailTabNavigation } from "./DetailTabNavigation";
import { DetailSidebar } from "./DetailSidebar";
import { BlueprintViewer } from "./BlueprintViewer";
import { BlueprintInfo } from "./BlueprintInfo";
import { Card, CardContent } from "@/shared/shadcnui";
import blueprintsData from "../data/blueprints.json";

interface SimilarBlueprint {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  similarity: number;
  createdAt: string;
}

interface BlueprintFile {
  id: string;
  name: string;
  description: string;
  size: number;
  type: string;
  imageUrl: string;
  createdAt: string;
  isActive?: boolean;
  similarBlueprints?: SimilarBlueprint[];
}

export default function BlueprintDetail() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("blueprint");
  const [blueprintFiles, setBlueprintFiles] = useState<BlueprintFile[]>(blueprintsData);
  const [activeFile, setActiveFile] = useState<BlueprintFile | null>(null);
  const [activeInfoTab, setActiveInfoTab] = useState("basic");
  const [isSearchingBlueprints, setIsSearchingBlueprints] = useState(false);

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

  // 類似図面検索ハンドラー
  const handleSimilarBlueprintSearch = () => {
    setIsSearchingBlueprints(true);
    setActiveInfoTab("similar");
    
    // 5秒のローディングをシミュレート（実際の実装ではAI画像解析APIコール）
    setTimeout(() => {
      setIsSearchingBlueprints(false);
    }, 5000);
  };

  // タブ変更ハンドラー
  const handleInfoTabChange = (value: string) => {
    setActiveInfoTab(value);
  };

  // 類似図面クリックハンドラー
  const handleSimilarBlueprintClick = (blueprint: SimilarBlueprint) => {
    console.log('類似図面がクリックされました:', blueprint);
    // 将来的には詳細表示や新しいタブで開く処理を実装
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
          <BlueprintViewer 
            activeFile={activeFile} 
            onSimilarBlueprintSearch={handleSimilarBlueprintSearch}
          />
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
        
        {/* 右側パネル */}
        {activeTab === "blueprint" && (
          activeFile ? (
            <Card className="w-80 border-l border-t-0 border-b-0 border-r-0 rounded-none h-full">
              <CardContent className="p-0 h-full">
                <BlueprintInfo
                  activeFile={activeFile}
                  onSimilarBlueprintClick={handleSimilarBlueprintClick}
                  activeTab={activeInfoTab}
                  onTabChange={handleInfoTabChange}
                  isSearchingBlueprints={isSearchingBlueprints}
                />
              </CardContent>
            </Card>
          ) : (
            <div className="w-80 border-l bg-gray-50 flex items-center justify-center p-4">
              <div className="text-center space-y-2">
                <div className="text-4xl text-gray-300">📋</div>
                <div className="text-sm text-gray-500">
                  図面を選択してください
                </div>
              </div>
            </div>
          )
        )}
        
      </div>
    </div>
  );
}