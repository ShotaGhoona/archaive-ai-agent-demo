"use client";
import React, { useState } from "react";
import { ConfigBasedTableView } from "@/shared";
import { createQuotationTableConfig } from "../lib";
import { Quotation } from "../model";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/shared";

interface QuotationTableViewProps {
  quotations: Quotation[];
  onQuotationDelete?: (quotation: Quotation) => void;
}

export function DocumentHomeQuotationTableView({ 
  quotations,
  onQuotationDelete
}: QuotationTableViewProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [quotationToDelete, setQuotationToDelete] = useState<Quotation | null>(null);

  const handleDeleteClick = (quotation: Quotation) => {
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
      <ConfigBasedTableView
        data={quotations}
        config={tableConfig}
        getRowId={(quotation) => quotation.id.toString()}
      />
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>見積書を削除しますか？</AlertDialogTitle>
            <AlertDialogDescription>
              「{quotationToDelete?.name}」を削除します。この操作は取り消すことができません。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDeleteCancel}>
              キャンセル
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              削除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}