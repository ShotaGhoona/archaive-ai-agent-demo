"use client";
import React, { useState } from "react";
import { ConfigBasedTableView } from "@/shared";
import { createSpecificationTableConfig } from "../lib";
import { Specification } from "../model";
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

interface SpecificationTableViewProps {
  specifications: Specification[];
  onSpecificationDelete?: (specification: Specification) => void;
}

export function DocumentHomeSpecificationTableView({ 
  specifications,
  onSpecificationDelete
}: SpecificationTableViewProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [specificationToDelete, setSpecificationToDelete] = useState<Specification | null>(null);

  const handleDeleteClick = (specification: Specification) => {
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
      <ConfigBasedTableView
        data={specifications}
        config={tableConfig}
        getRowId={(specification) => specification.id.toString()}
      />
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>仕様書を削除しますか？</AlertDialogTitle>
            <AlertDialogDescription>
              「{specificationToDelete?.name}」を削除します。この操作は取り消すことができません。
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