"use client";

import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface GeneralPopoverProps {
  onFileAttach: (file: File) => void;
}

const GeneralPopover: React.FC<GeneralPopoverProps> = ({ 
  onFileAttach
}) => {

  return (
    <div className="space-y-4">

      <Button variant="outline" onClick={() => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.onchange = (e) => {
          const file = (e.target as HTMLInputElement).files?.[0];
          if (file) {
            onFileAttach(file);
          }
        };
        fileInput.click();
      }}>
        <Upload className="w-4 h-4 mr-2" />
        画像アップロード
      </Button>
    </div>
  );
};

export default GeneralPopover;