'use client';
import React, { useState } from 'react';
import { TableView } from '@/shared';
import { createInvoiceTableConfig } from '../lib';
import { DocumentInvoiceDataInterface } from '@/dummy-data-er-fix/document';
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

interface InvoiceTableViewProps {
  invoices: DocumentInvoiceDataInterface[];
  onInvoiceDelete?: (invoice: DocumentInvoiceDataInterface) => void;
  onInvoiceUpdate?: (rowId: string, field: string, value: unknown) => void;
}

export function DocumentHomeInvoiceTableView({
  invoices,
  onInvoiceDelete,
  onInvoiceUpdate,
}: InvoiceTableViewProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] =
    useState<DocumentInvoiceDataInterface | null>(null);

  const handleDeleteClick = (invoice: DocumentInvoiceDataInterface) => {
    setInvoiceToDelete(invoice);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (invoiceToDelete && onInvoiceDelete) {
      onInvoiceDelete(invoiceToDelete);
    }
    setDeleteDialogOpen(false);
    setInvoiceToDelete(null);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setInvoiceToDelete(null);
  };

  const tableConfig = createInvoiceTableConfig({
    onDelete: handleDeleteClick,
  });

  return (
    <>
      <TableView
        data={invoices}
        config={tableConfig}
        getRowId={(invoice) => invoice.id.toString()}
        onItemUpdate={onInvoiceUpdate}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>請求書を削除しますか？</AlertDialogTitle>
            <AlertDialogDescription>
              「{invoiceToDelete?.directory_document_custom_items?.請求書番号?.value || 'N/A'}
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
