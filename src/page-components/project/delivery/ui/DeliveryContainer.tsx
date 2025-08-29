"use client";

import { useState } from "react";
import { DocumentDetailViewContainer } from "@/shared/view/document-detail-view";
import { DeliveryData } from "../model";
import { deliveryData as initialDeliveryData } from "../data";
import { createDeliveryDetailConfig } from "../lib/deliveryDetailConfig";

export function DeliveryContainer() {
  const [deliveries] = useState<DeliveryData[]>(initialDeliveryData as DeliveryData[]);
  const config = createDeliveryDetailConfig();

  return (
    <DocumentDetailViewContainer
      data={deliveries}
      config={config}
    />
  );
}