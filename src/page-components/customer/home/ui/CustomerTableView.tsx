"use client";
import React, { useState } from "react";
import { ConfigBasedTableView } from "@/shared";
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
}

export function CustomerTableView({ 
  customers,
  onCustomerDelete
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
      <ConfigBasedTableView
        data={customers}
        config={tableConfig}
        getRowId={(customer) => customer.id.toString()}
      />
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>顧客を削除しますか？</AlertDialogTitle>
            <AlertDialogDescription>
              「{customerToDelete?.name}」を削除します。この操作は取り消すことができません。
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