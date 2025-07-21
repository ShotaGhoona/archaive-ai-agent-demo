"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { X, Upload } from "lucide-react";

interface GeneralPopoverProps {
  onImageUpload: (file: File, message: string) => void;
  onClose: () => void;
}

// 🎯 ImageUploadArea コンポーネント
function ImageUploadArea({ 
  onImageUpload, 
  acceptedTypes, 
  maxSize 
}: {
  onImageUpload: (file: File) => void;
  acceptedTypes: string[];
  maxSize: number;
}) {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
      <p className="text-sm text-gray-600 mb-2">
        画像をドラッグ&ドロップ、またはクリックして選択
      </p>
      <input
        type="file"
        accept={acceptedTypes.join(',')}
        onChange={handleFileChange}
        className="hidden"
        id="image-upload"
      />
      <label 
        htmlFor="image-upload"
        className="inline-block px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 cursor-pointer"
      >
        ファイルを選択
      </label>
      <p className="text-xs text-gray-400 mt-2">
        対応形式: {acceptedTypes.join(', ')} (最大{(maxSize / (1024 * 1024)).toFixed(0)}MB)
      </p>
    </div>
  );
}

const GeneralPopover: React.FC<GeneralPopoverProps> = ({ 
  onImageUpload, 
  onClose 
}) => {
  const [message, setMessage] = useState('添付した画像について教えてください。');

  const handleImageSelected = (file: File) => {
    onImageUpload(file, message);
    onClose();
  };

  return (
    <div className="space-y-4 w-96">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-gray-900">画像添付</h4>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <p className="text-sm text-gray-600">
        図面や参考画像を添付して質問できます
      </p>
      
      <div className="space-y-3">
        <ImageUploadArea
          onImageUpload={handleImageSelected}
          acceptedTypes={['.jpg', '.jpeg', '.png', '.webp']}
          maxSize={10 * 1024 * 1024}
        />
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            質問内容
          </label>
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="画像について何を知りたいですか？"
            className="resize-none"
            rows={2}
          />
        </div>
      </div>
    </div>
  );
};

export default GeneralPopover;