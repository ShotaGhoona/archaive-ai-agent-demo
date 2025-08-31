'use client';
import React, { useState } from 'react';
import { TableView } from '@/shared/view/table-view';
import { createContactTableConfig } from '../lib';
import { CustomerContactDataInterface } from '@/dummy-data-er-fix/customer';
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

interface CustomerContactTableViewProps {
  contacts: CustomerContactDataInterface[];
  onContactDelete?: (contact: CustomerContactDataInterface) => void;
  onContactUpdate?: (rowId: string, field: string, value: unknown) => void;
}

export function CustomerContactTableView({
  contacts,
  onContactDelete,
  onContactUpdate,
}: CustomerContactTableViewProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<CustomerContactDataInterface  | null>(null);

  const handleDeleteClick = (contact: CustomerContactDataInterface) => {
    setContactToDelete(contact);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (contactToDelete && onContactDelete) {
      onContactDelete(contactToDelete);
    }
    setDeleteDialogOpen(false);
    setContactToDelete(null);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setContactToDelete(null);
  };

  const tableConfig = createContactTableConfig({
    onDelete: handleDeleteClick,
  });

  return (
    <>
      <TableView
        data={contacts}
        config={tableConfig}
        getRowId={(contact) => contact.id.toString()}
        onItemUpdate={onContactUpdate}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>担当者を削除しますか？</AlertDialogTitle>
            <AlertDialogDescription>
              「{contactToDelete?.last_name} {contactToDelete?.first_name}
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
