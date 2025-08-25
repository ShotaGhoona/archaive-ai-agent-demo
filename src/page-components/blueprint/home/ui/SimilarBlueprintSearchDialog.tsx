"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared";
import { Search, Upload } from "lucide-react";

export function SimilarBlueprintSearchDialog() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    if (file && (file.type.startsWith('image/') || file.name.endsWith('.dwg') || file.name.endsWith('.step') || file.name.endsWith('.igs') || file.name.endsWith('.pdf'))) {
      // アップロード完了後に遷移
      setIsOpen(false);
      router.push('/project/INT-2024-001/blueprint');
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button size="lg">
          <Search className="h-5 w-5 mr-2" />
          類似図面検索
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="end">
        <div className="space-y-3">
          <h3 className="text-sm font-medium">類似図面検索</h3>
          
          {/* ファイルアップロード領域 */}
          <div
            className={`
              border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
              ${dragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-gray-400'}
            `}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".dwg,.step,.igs,.png,.jpg,.jpeg,.pdf"
              onChange={handleFileInputChange}
              className="hidden"
            />
            
            <div className="space-y-2">
              <Upload className="h-8 w-8 text-gray-400 mx-auto" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-700">
                  図面ファイルをアップロード
                </p>
                <p className="text-xs text-gray-500">
                  ドラッグ&ドロップまたはクリック
                </p>
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}