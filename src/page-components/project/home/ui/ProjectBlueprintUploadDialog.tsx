"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Card,
  CardContent,
  Badge,
  Loading,
} from "@/shared";
import { Plus, Upload } from "lucide-react";

interface BlueprintUploadDialogProps {
  onUploadComplete?: () => void;
}

export function ProjectBlueprintUploadDialog({ onUploadComplete }: BlueprintUploadDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    
    try {
      // アップロード処理をシミュレート（2秒間）
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // アップロード完了後、プロジェクト詳細ページに遷移
      const projectId = "PJ-2024-001"; // 実際にはAPIから取得
      router.push(`/project/${projectId}/basic-information`);
      
      // ダイアログを閉じる
      setIsOpen(false);
      onUploadComplete?.();
    } catch (error) {
      console.error('アップロードエラー:', error);
    } finally {
      setIsUploading(false);
      // ファイル入力をリセット
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };


  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button size="lg" className="bg-primary hover:bg-primary/90">
          <Plus className="h-5 w-5 mr-2" />
          案件登録
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end">
        <Card className="border-0 shadow-none">
          <CardContent className="space-y-4">
            {/* ファイルアップロード領域 */}
            <div
              className={`
                border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
                border-gray-300 hover:border-gray-400
                `}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".dwg,.step,.igs,.png,.jpg,.jpeg,.pdf"
                className="hidden"
                onChange={handleFileSelect}
              />
              
              {isUploading ? (
                <Loading 
                  size="md"
                  title="アップロード中..."
                  description="しばらくお待ちください"
                />
              ) : (
                <div className="space-y-2">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-700">
                      図面ファイルをアップロード
                    </p>
                    <p className="text-xs text-gray-500">
                      複数ファイル対応 - 選択後自動で登録画面へ
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1 justify-center mt-2">
                    <Badge variant="outline" className="text-xs">DWG</Badge>
                    <Badge variant="outline" className="text-xs">STEP</Badge>
                    <Badge variant="outline" className="text-xs">IGS</Badge>
                    <Badge variant="outline" className="text-xs">PNG</Badge>
                    <Badge variant="outline" className="text-xs">JPG</Badge>
                    <Badge variant="outline" className="text-xs">PDF</Badge>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
}