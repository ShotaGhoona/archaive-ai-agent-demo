'use client';
import React, { useState } from 'react';
import { TableView } from '@/shared';
import { createSpecificationTableConfig } from '../lib';
import { DocumentSpecificationDataInterface } from '@/dummy-data-er-fix/document';
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

interface SpecificationTableViewProps {
  specifications: DocumentSpecificationDataInterface[];
  onSpecificationDelete?: (
    specification: DocumentSpecificationDataInterface,
  ) => void;
  onSpecificationUpdate?: (
    rowId: string,
    field: string,
    value: unknown,
  ) => void;
}

export function DocumentHomeSpecificationTableView({
  specifications,
  onSpecificationDelete,
  onSpecificationUpdate,
}: SpecificationTableViewProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [specificationToDelete, setSpecificationToDelete] =
    useState<DocumentSpecificationDataInterface | null>(null);

  const handleDeleteClick = (
    specification: DocumentSpecificationDataInterface,
  ) => {
    setSpecificationToDelete(specification);
    setDeleteDialogOpen(true);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSpecificationToDelete(null);
  };

  const handleDeleteConfirm = () => {
    if (specificationToDelete && onSpecificationDelete) {
      onSpecificationDelete(specificationToDelete);
    }
    setDeleteDialogOpen(false);
    setSpecificationToDelete(null);
  };

  const tableConfig = createSpecificationTableConfig({
    onDelete: handleDeleteClick,
  });

  return (
    <>
      <TableView
        data={specifications}
        config={tableConfig}
        getRowId={(specification) => specification.id.toString()}
        onItemUpdate={onSpecificationUpdate}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>仕様書を削除しますか？</AlertDialogTitle>
            <AlertDialogDescription>
              「{specificationToDelete?.leaf_product_document_custom_items?.仕様書番号?.value || 'N/A'}
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
