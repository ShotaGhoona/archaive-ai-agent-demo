"use client";

import { Button } from "@/shared/shadcnui";
import { X } from "lucide-react";

interface TroublePopoverProps {
  onClose: () => void;
}

const TroublePopover: React.FC<TroublePopoverProps> = ({ 
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
      

    </div>
  );
};

export default TroublePopover;