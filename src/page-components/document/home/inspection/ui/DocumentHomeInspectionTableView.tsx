"use client";
import React, { useState } from "react";
import { ConfigBasedTableView } from "@/shared";
import { createInspectionTableConfig } from "../lib";
import { Inspection } from "../model";
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

interface InspectionTableViewProps {
  inspections: Inspection[];
  onInspectionDelete?: (inspection: Inspection) => void;
}

export function DocumentHomeInspectionTableView({ 
  inspections,
  onInspectionDelete
}: InspectionTableViewProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [inspectionToDelete, setInspectionToDelete] = useState<Inspection | null>(null);

  const handleDeleteClick = (inspection: Inspection) => {
    setInspectionToDelete(inspection);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (inspectionToDelete && onInspectionDelete) {
      onInspectionDelete(inspectionToDelete);
    }
    setDeleteDialogOpen(false);
    setInspectionToDelete(null);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setInspectionToDelete(null);
  };

  const tableConfig = createInspectionTableConfig({
    onDelete: handleDeleteClick,
  });

  return (
    <>
      <ConfigBasedTableView
        data={inspections}
        config={tableConfig}
        getRowId={(inspection) => inspection.id.toString()}
      />
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>検査表を削除しますか？</AlertDialogTitle>
            <AlertDialogDescription>
              「{inspectionToDelete?.name}」を削除します。この操作は取り消すことができません。
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