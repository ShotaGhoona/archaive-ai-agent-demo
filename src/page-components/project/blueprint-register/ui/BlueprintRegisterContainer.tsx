"use client";
import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/shared/shadcnui";
import BlueprintUploadGallery from "./BlueprintUploadGallery";
import RepeatProductSearchPanel from "./RepeatProductSearchPanel";

export default function BlueprintRegisterContainer() {
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);

  const handleRepeatSearch = () => {
    setIsRightPanelOpen(true);
  };

  const handleCloseRightPanel = () => {
    setIsRightPanelOpen(false);
  };

  return (
    <div className="flex h-full bg-white">
      {/* メインコンテンツエリア */}
      <div className="flex flex-col h-full overflow-hidden">
        {/* ページヘッダー */}
        <div className="flex justify-between items-center p-6 pb-0">
          <h3 className="text-lg font-semibold">図面登録</h3>
          <Button onClick={isRightPanelOpen ? handleCloseRightPanel : handleRepeatSearch} size="lg">
            <Search className="h-4 w-4 mr-2" />
            {isRightPanelOpen ? "パネルを閉じる" : "リピート品を探す"}
          </Button>
        </div>
        {/* 図面アップロードギャラリー */}
        <div className={`transition-all duration-300 ${isRightPanelOpen ? 'w-1/2' : 'w-full'}`}>
          <BlueprintUploadGallery />
        </div>

      </div>
        {/* リピート品検索パネル */}
        <RepeatProductSearchPanel isOpen={isRightPanelOpen} onClose={handleCloseRightPanel} />
    </div>
  );
}