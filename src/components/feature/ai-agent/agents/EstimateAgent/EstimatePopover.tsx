"use client";

import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import FileUploadArea from "./FileUploadArea";

interface EstimatePopoverProps {
  onFileUpload: (file: File, message: string) => void;
  onClose: () => void;
}

const EstimatePopover: React.FC<EstimatePopoverProps> = ({ 
  onFileUpload, 
  onClose 
}) => {
  return (
    <div className="space-y-4 w-96">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-gray-900">図面アップロード</h4>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <p className="text-sm text-gray-600">
        製造図面をアップロードして見積もりを依頼してください
      </p>
      
      <FileUploadArea
        onFileUpload={(file) => {
          onFileUpload(file, '添付した図面の見積もりをお願いします。');
          onClose();
        }}
        acceptedTypes={['.jpg', '.jpeg', '.png', '.webp']}
        maxSize={20 * 1024 * 1024}
        compact={true}
      />
    </div>
  );
};

export default EstimatePopover;