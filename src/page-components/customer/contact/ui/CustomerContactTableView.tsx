import React from "react";
import { TableView } from "@/shared/view/table-view";
import { Contact } from "../lib/contactColumns";
import { CONTACT_COLUMNS } from "../lib/contactColumns";

interface ContactTableViewProps {
  contacts: Contact[];
  onContactUpdate?: (contactId: string, field: string, value: unknown) => void;
  // ページネーション統合のための新しいprops
  currentPage?: number;
  totalItems?: number;
  itemsPerPage?: number;
  onPageChange?: (page: number) => void;
}

export function ContactTableView({ 
  contacts, 
  onContactUpdate,
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange
}: ContactTableViewProps) {
  // ページネーション設定
  const paginationConfig = currentPage && totalItems && itemsPerPage && onPageChange ? {
    enabled: true,
    currentPage,
    itemsPerPage,
    totalItems,
    onPageChange,
    showTotalItems: true,
  } : undefined;

  return (
    <TableView
      data={contacts}
      columns={CONTACT_COLUMNS}
      onItemUpdate={onContactUpdate}
      getRowId={(contact) => contact.contactId}
      emptyMessage="顧客データがありません"
      pagination={paginationConfig}
    />
  );
}