"use client";

import { Button } from "@/shared/shadcnui";
import { X, Upload } from "lucide-react";
import { useCallback } from "react";

interface TroublePopoverProps {
  onClose: () => void;
  onFileAttach?: (file: File) => void;
}

const TroublePopover: React.FC<TroublePopoverProps> = ({ 
  onClose,
  onFileAttach
}) => {
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onFileAttach) {
      onFileAttach(file);
      onClose();
    }
  }, [onFileAttach, onClose]);

  return (
    <div className="space-y-4 w-96">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-gray-900">図面アップロード</h4>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <p className="text-sm text-gray-600">
        過去のトラブル、見積もり、仕様書を検索するために図面をアップロードしてください
      </p>
      
      <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
        <Upload className="h-8 w-8 text-gray-400 mb-2" />
        <label htmlFor="file-upload" className="cursor-pointer">
          <span className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            ファイルを選択
          </span>
          <input
            id="file-upload"
            type="file"
            className="sr-only"
            accept="image/*,.pdf"
            onChange={handleFileSelect}
          />
        </label>
        <p className="text-xs text-gray-500 mt-1">
          PNG, JPG, PDF (最大10MB)
        </p>
      </div>
    </div>
  );
};

export default TroublePopover;