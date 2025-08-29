"use client";

import { useState } from "react";
import { Card, CardContent, Button } from "@/shared";
import { FileText } from "lucide-react";
import { DocumentData, DocumentDetailViewConfig } from "../model";
import { DocumentRegistrationDialog } from "./DocumentRegistrationDialog";

interface DocumentListProps<T extends DocumentData> {
  items: T[];
  selectedId: string | null;
  config: DocumentDetailViewConfig<T>;
  onSelect: (item: T) => void;
  documentType?: string;
}

export function DocumentList<T extends DocumentData>({
  items,
  selectedId,
  config,
  onSelect,
  documentType = "帳票",
}: DocumentListProps<T>) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const sortedItems = items.sort((a, b) => 
    new Date(b.modified_date).getTime() - new Date(a.modified_date).getTime()
  );

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  return (
    <div className="h-full bg-white border-r flex flex-col">
      <div className="flex-1 p-4 pt-0 space-y-4 mt-4">
        <Button 
          size="lg" 
          variant="outline" 
          className="w-full py-8"
          onClick={handleOpenDialog}
        >
          <FileText className="h-4 w-4 mr-2" />
          {documentType}を登録or作成
        </Button>
        
        {sortedItems.map((item) => {
          const itemId = config.dataConfig.getItemId(item);
          const isSelected = selectedId === itemId;
          const imageUrl = config.dataConfig.getImageUrl(item);
          
          return (
            <Card 
              key={itemId}
              onClick={() => onSelect(item)}
              className={`
                cursor-pointer transition-all duration-200 group relative py-1
                ${isSelected 
                  ? 'ring-2 ring-primary' 
                  : 'hover:shadow-md hover:bg-gray-50'
                }
              `}
            >
              <CardContent className="p-2">
                <div className="space-y-2">
                  <div className="aspect-video w-full bg-gray-100 rounded overflow-hidden">
                    {imageUrl ? (
                      <img 
                        src={imageUrl} 
                        alt={config.dataConfig.getItemTitle(item)}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FileText className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="px-1">
                    <h4 className="text-xs font-medium text-gray-900 truncate">
                      {config.dataConfig.getItemTitle(item)}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(item.modified_date).toLocaleDateString('ja-JP')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <DocumentRegistrationDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        documentType={documentType}
      />
    </div>
  );
}