"use client";

import { useState } from "react";
import { DocumentDetailViewContainer } from "@/shared/view/document-detail-view";
import { OrderData } from "../model";
import { orderData as initialOrderData } from "../data";
import { createOrderDetailConfig } from "../lib/orderDetailConfig";

export function OrderContainer() {
  const [orders] = useState<OrderData[]>(initialOrderData as OrderData[]);
  const config = createOrderDetailConfig();

  return (
    <DocumentDetailViewContainer
      data={orders}
      config={config}
    />
  );
}