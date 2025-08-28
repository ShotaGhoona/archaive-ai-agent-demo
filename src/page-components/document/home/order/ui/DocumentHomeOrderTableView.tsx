"use client";
import React, { useState } from "react";
import { TableView } from "@/shared";
import { createOrderTableConfig } from "../lib";
import { Order } from "../model";
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

interface OrderTableViewProps {
  orders: Order[];
  onOrderDelete?: (order: Order) => void;
}

export function DocumentHomeOrderTableView({ 
  orders,
  onOrderDelete
}: OrderTableViewProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);

  const handleDeleteClick = (order: Order) => {
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
      />
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>発注書を削除しますか？</AlertDialogTitle>
            <AlertDialogDescription>
              「{orderToDelete?.name}」を削除します。この操作は取り消すことができません。
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