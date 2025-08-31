'use client';
import React, { useState } from 'react';
import { TableView } from '@/shared';
import { createQuotationTableConfig } from '../lib';
import { DocumentQuotationDataInterface } from '@/dummy-data-er-fix/document';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared';

interface QuotationTableViewProps {
  quotations: DocumentQuotationDataInterface[];
  onQuotationDelete?: (quotation: DocumentQuotationDataInterface) => void;
  onQuotationUpdate?: (rowId: string, field: string, value: unknown) => void;
}

export function DocumentHomeQuotationTableView({
  quotations,
  onQuotationDelete,
  onQuotationUpdate,
}: QuotationTableViewProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [quotationToDelete, setQuotationToDelete] =
    useState<DocumentQuotationDataInterface | null>(null);

  const handleDeleteClick = (quotation: DocumentQuotationDataInterface) => {
    setQuotationToDelete(quotation);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (quotationToDelete && onQuotationDelete) {
      onQuotationDelete(quotationToDelete);
    }
    setDeleteDialogOpen(false);
    setQuotationToDelete(null);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setQuotationToDelete(null);
  };

  const tableConfig = createQuotationTableConfig({
    onDelete: handleDeleteClick,
  });

  return (
    <>
      <TableView
        data={quotations}
        config={tableConfig}
        getRowId={(quotation) => quotation.id.toString()}
        onItemUpdate={onQuotationUpdate}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>見積書を削除しますか？</AlertDialogTitle>
            <AlertDialogDescription>
              「{quotationToDelete?.quotation_number || 'N/A'}
              」を削除します。この操作は取り消すことができません。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDeleteCancel}>
              キャンセル
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className='bg-red-600 hover:bg-red-700'
            >
              削除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
