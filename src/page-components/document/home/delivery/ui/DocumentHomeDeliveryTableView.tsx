"use client";
import React, { useState } from "react";
import { TableView } from "@/shared";
import { createDeliveryTableConfig } from "../lib";
import { Delivery } from "../model";
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

interface DeliveryTableViewProps {
  deliveries: Delivery[];
  onDeliveryDelete?: (delivery: Delivery) => void;
}

export function DocumentHomeDeliveryTableView({ 
  deliveries,
  onDeliveryDelete
}: DeliveryTableViewProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deliveryToDelete, setDeliveryToDelete] = useState<Delivery | null>(null);

  const handleDeleteClick = (delivery: Delivery) => {
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
      />
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>納品書を削除しますか？</AlertDialogTitle>
            <AlertDialogDescription>
              「{deliveryToDelete?.name}」を削除します。この操作は取り消すことができません。
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