import React from "react";
import { TableView } from "@/shared";
import { Contact, CONTACT_COLUMNS } from "../lib";

interface CustomerContactTableViewProps {
  contacts: Contact[];
  onContactUpdate?: (contactId: string, field: string, value: unknown) => void;
  // ページネーション統合のための新しいprops
  currentPage?: number;
  totalItems?: number;
  itemsPerPage?: number;
  onPageChange?: (page: number) => void;
}

export function CustomerContactTableView({ 
  contacts, 
  onContactUpdate,
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange
}: CustomerContactTableViewProps) {
  // ページネーション設定
  const paginationConfig = currentPage && totalItems && itemsPerPage && onPageChange ? {
    enabled: true,
    currentPage,
    itemsPerPage,
    totalItems,
    onPageChange,
  } : undefined;

  return (
    <TableView
      data={contacts}
      columns={CONTACT_COLUMNS}
      onItemUpdate={onContactUpdate}
      getRowId={(contact) => contact.contactId}
      pagination={paginationConfig}
    />
  );
}