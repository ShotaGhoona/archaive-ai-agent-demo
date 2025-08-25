import React from "react";
import { ConfigBasedTableView } from "@/shared/view/table-view";
import { Contact, createContactTableConfig } from "../lib";

interface CustomerContactTableViewProps {
  contacts: Contact[];
  onContactUpdate?: (contactId: string, field: string, value: unknown) => void;
}

export function CustomerContactTableView({ 
  contacts, 
  onContactUpdate
}: CustomerContactTableViewProps) {
  const tableConfig = createContactTableConfig();

  return (
    <ConfigBasedTableView
      data={contacts}
      config={tableConfig}
      onItemUpdate={onContactUpdate}
      getRowId={(contact) => contact.contactId}
    />
  );
}