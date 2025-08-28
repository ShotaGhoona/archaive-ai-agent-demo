"use client";
import React, { useState } from "react";
import { TableView } from "@/shared";
import { createCustomerTableConfig } from "../lib";
import { Customer } from "../model";
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

interface CustomerTableViewProps {
  customers: Customer[];
  onCustomerDelete?: (customer: Customer) => void;
  onCustomerUpdate?: (rowId: string, field: string, value: unknown) => void;
}

export function CustomerTableView({ 
  customers,
  onCustomerDelete,
  onCustomerUpdate
}: CustomerTableViewProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);

  const handleDeleteClick = (customer: Customer) => {
    setCustomerToDelete(customer);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (customerToDelete && onCustomerDelete) {
      onCustomerDelete(customerToDelete);
    }
    setDeleteDialogOpen(false);
    setCustomerToDelete(null);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setCustomerToDelete(null);
  };

  const tableConfig = createCustomerTableConfig({
    onDelete: handleDeleteClick,
  });

  return (
    <>
      <TableView
        data={customers}
        config={tableConfig}
        getRowId={(customer) => customer.id.toString()}
        onItemUpdate={onCustomerUpdate}
      />
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>取引先を削除しますか？</AlertDialogTitle>
            <AlertDialogDescription>
              「{customerToDelete?.account_name}」を削除します。この操作は取り消すことができません。
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