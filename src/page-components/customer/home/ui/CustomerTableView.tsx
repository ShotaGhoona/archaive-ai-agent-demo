import React from "react";
import { TableView } from "@/shared/view/table-view";
import { Customer, CUSTOMER_COLUMNS } from "../lib/customerColumns";

interface CustomerTableViewProps {
  customers: Customer[];
  onCustomerUpdate?: (customerCode: string, field: string, value: unknown) => void;
  // ページネーション統合のための新しいprops
  currentPage?: number;
  totalItems?: number;
  itemsPerPage?: number;
  onPageChange?: (page: number) => void;
}

export function CustomerTableView({ 
  customers, 
  onCustomerUpdate,
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange
}: CustomerTableViewProps) {
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
      data={customers}
      columns={CUSTOMER_COLUMNS}
      onItemUpdate={onCustomerUpdate}
      getRowId={(customer) => customer.customerCode}
      pagination={paginationConfig}
    />
  );
}