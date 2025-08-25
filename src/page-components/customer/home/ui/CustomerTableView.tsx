import React from "react";
import { ConfigBasedTableView } from "@/shared/view/table-view";
import { Customer, createCustomerTableConfig } from "../lib";

interface CustomerTableViewProps {
  customers: Customer[];
  onCustomerUpdate?: (customerCode: string, field: string, value: unknown) => void;
}

export function CustomerTableView({ 
  customers, 
  onCustomerUpdate
}: CustomerTableViewProps) {
  const tableConfig = createCustomerTableConfig();

  return (
    <ConfigBasedTableView
      data={customers}
      config={tableConfig}
      onItemUpdate={onCustomerUpdate}
      getRowId={(customer) => customer.customerCode}
    />
  );
}