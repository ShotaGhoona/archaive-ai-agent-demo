'use client';
import React, { useState } from 'react';
import { TableView } from '@/shared';
import { createOrderTableConfig } from '../lib';
import { DocumentOrderDataInterface } from '@/dummy-data-er-fix/document';
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

interface OrderTableViewProps {
  orders: DocumentOrderDataInterface[];
  onOrderDelete?: (order: DocumentOrderDataInterface) => void;
  onOrderUpdate?: (rowId: string, field: string, value: unknown) => void;
}

export function DocumentHomeOrderTableView({
  orders,
  onOrderDelete,
  onOrderUpdate,
}: OrderTableViewProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] =
    useState<DocumentOrderDataInterface | null>(null);

  const handleDeleteClick = (order: DocumentOrderDataInterface) => {
    setOrderToDelete(order);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (orderToDelete && onOrderDelete) {
      onOrderDelete(orderToDelete);
    }
    setDeleteDialogOpen(false);
    setOrderToDelete(null);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setOrderToDelete(null);
  };

  const tableConfig = createOrderTableConfig({
    onDelete: handleDeleteClick,
  });

  return (
    <>
      <TableView
        data={orders}
        config={tableConfig}
        getRowId={(order) => order.id.toString()}
        onItemUpdate={onOrderUpdate}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>発注書を削除しますか？</AlertDialogTitle>
            <AlertDialogDescription>
              「{orderToDelete?.directory_document_custom_items?.受注番号?.value || 'N/A'}
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
