'use client';
import React, { useState } from 'react';
import { TableView } from '@/shared';
import { createDeliveryTableConfig } from '../lib';
import { DocumentDeliveryDataInterface } from '@/dummy-data-er-fix/document';
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

interface DeliveryTableViewProps {
  deliveries: DocumentDeliveryDataInterface[];
  onDeliveryDelete?: (delivery: DocumentDeliveryDataInterface) => void;
  onDeliveryUpdate?: (rowId: string, field: string, value: unknown) => void;
}

export function DocumentHomeDeliveryTableView({
  deliveries,
  onDeliveryDelete,
  onDeliveryUpdate,
}: DeliveryTableViewProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deliveryToDelete, setDeliveryToDelete] =
    useState<DocumentDeliveryDataInterface | null>(null);

  const handleDeleteClick = (delivery: DocumentDeliveryDataInterface) => {
    setDeliveryToDelete(delivery);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (deliveryToDelete && onDeliveryDelete) {
      onDeliveryDelete(deliveryToDelete);
    }
    setDeleteDialogOpen(false);
    setDeliveryToDelete(null);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setDeliveryToDelete(null);
  };

  const tableConfig = createDeliveryTableConfig({
    onDelete: handleDeleteClick,
  });

  return (
    <>
      <TableView
        data={deliveries}
        config={tableConfig}
        getRowId={(delivery) => delivery.id.toString()}
        onItemUpdate={onDeliveryUpdate}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>納品書を削除しますか？</AlertDialogTitle>
            <AlertDialogDescription>
              「{deliveryToDelete?.name}
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
