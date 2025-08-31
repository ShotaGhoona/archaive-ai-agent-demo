'use client';

import { useState } from 'react';
import { Card, CardContent, Button } from '@/shared';
import { FileText } from 'lucide-react';
import { DocumentData, DocumentDetailViewConfig } from '../model';
import { DocumentRegistrationDialog } from './DocumentRegistrationDialog';

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
  documentType = '帳票',
}: DocumentListProps<T>) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const sortedItems = items.sort(
    (a, b) => b.version - a.version,
  );

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  return (
    <div className='flex h-full flex-col border-r bg-white'>
      <div className='mt-4 flex-1 space-y-4 p-4 pt-0'>
        <Button
          size='lg'
          variant='outline'
          className='w-full py-8'
          onClick={handleOpenDialog}
        >
          <FileText className='mr-2 h-4 w-4' />
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
              className={`group relative cursor-pointer py-1 transition-all duration-200 ${
                isSelected
                  ? 'ring-primary ring-2'
                  : 'hover:bg-gray-50 hover:shadow-md'
              } `}
            >
              <CardContent className='p-2'>
                <div className='space-y-2'>
                  <div className='aspect-video w-full overflow-hidden rounded bg-gray-100'>
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={config.dataConfig.getItemTitle(item)}
                        className='h-full w-full object-cover'
                        loading='lazy'
                      />
                    ) : (
                      <div className='flex h-full w-full items-center justify-center'>
                        <FileText className='h-8 w-8 text-gray-400' />
                      </div>
                    )}
                  </div>
                  <div className='px-1'>
                    <h4 className='truncate text-xs font-medium text-gray-900'>
                      {config.dataConfig.getItemTitle(item)}
                    </h4>
                    <p className='mt-1 text-xs text-gray-500'>
                      {new Date(config.dataConfig.getModifiedDate(item)).toLocaleDateString('ja-JP')}
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
        createConfig={config.createConfig}
      />
    </div>
  );
}
