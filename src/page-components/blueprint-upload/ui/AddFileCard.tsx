import { useState, useRef } from "react";
import { Card, CardContent, Badge } from "@/shared/shadcnui";
import { Plus, Upload, Loader2 } from "lucide-react";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  createdAt: Date;
}

interface AddFileCardProps {
  onAddFiles: (files: Omit<UploadedFile, 'id' | 'createdAt'>[]) => void;
}

export function AddFileCard({ onAddFiles }: AddFileCardProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (fileList: FileList) => {
    const validFiles = Array.from(fileList).filter(file => 
      file.type.startsWith('image/') || 
      file.name.endsWith('.dwg') || 
      file.name.endsWith('.step') || 
      file.name.endsWith('.igs') ||
      file.name.endsWith('.pdf')
    );
    
    if (validFiles.length > 0) {
      setIsUploading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const fileData = validFiles.map(file => ({
          name: file.name,
          size: file.size,
          type: file.type,
          url: URL.createObjectURL(file)
        }));
        
        onAddFiles(fileData);
      } catch (error) {
        console.error('アップロードエラー:', error);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (fileList && fileList.length > 0) {
      handleFileSelect(fileList);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const fileList = e.dataTransfer.files;
    if (fileList && fileList.length > 0) {
      handleFileSelect(fileList);
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
    <div 
      className={`
        relative overflow-hidden transition-all duration-200 cursor-pointer border-2 border-dashed rounded-lg bg-gray-100
        ${dragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-gray-400'}
        ${isUploading ? 'border-blue-300 bg-blue-50' : ''}
      `}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={() => !isUploading && fileInputRef.current?.click()}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".dwg,.step,.igs,.png,.jpg,.jpeg,.pdf"
        onChange={handleFileInputChange}
        className="hidden"
      />
      
      <div className="aspect-video flex items-center justify-center">
        {isUploading ? (
          <div className="text-center space-y-3">
            <Loader2 className="h-12 w-12 text-blue-600 animate-spin mx-auto" />
            <div className="text-sm text-blue-600 font-medium">
              アップロード中...
            </div>
          </div>
        ) : (
          <div className="text-center space-y-3">
            <div className="p-4 rounded-full bg-white/80 shadow-sm">
              <Plus className="h-12 w-12 text-gray-500 mx-auto" />
            </div>
            <div className="text-sm text-gray-600 font-medium">
              図面を追加
            </div>
          </div>
        )}
      </div>
      
      <div className="p-4 bg-white/50">
        <div className="space-y-3">
          <h3 className="font-medium text-gray-600 text-sm text-center">
            {isUploading ? 'アップロード中...' : 'ドラッグ&ドロップまたはクリック'}
          </h3>
          {!isUploading && (
            <div className="flex flex-wrap gap-1 justify-center">
              <Badge variant="secondary" className="text-xs bg-white/80">DWG</Badge>
              <Badge variant="secondary" className="text-xs bg-white/80">STEP</Badge>
              <Badge variant="secondary" className="text-xs bg-white/80">IGS</Badge>
              <Badge variant="secondary" className="text-xs bg-white/80">PDF</Badge>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}