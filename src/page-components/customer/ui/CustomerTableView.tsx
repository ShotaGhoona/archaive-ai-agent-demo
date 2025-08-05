import React from "react";
import { BasicDataTable } from "@/shared/basic-data-table";
import { Customer, CUSTOMER_COLUMNS } from "../lib/customerColumns";

interface CustomerTableViewProps {
  customers: Customer[];
  onCustomerUpdate?: (customerCode: string, field: string, value: unknown) => void;
}

export function CustomerTableView({ customers, onCustomerUpdate }: CustomerTableViewProps) {
  return (
    <BasicDataTable
      data={customers}
      columns={CUSTOMER_COLUMNS}
      onItemUpdate={onCustomerUpdate}
      getRowId={(customer) => customer.customerCode}
      emptyMessage="顧客データがありません"
    />
  );
}