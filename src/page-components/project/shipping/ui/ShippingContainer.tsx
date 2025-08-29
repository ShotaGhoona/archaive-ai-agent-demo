"use client";

import { useState } from "react";
import { DocumentDetailViewContainer } from "@/shared/view/document-detail-view";
import { ShippingData } from "../model";
import { shippingData as initialShippingData } from "../data";
import { createShippingDetailConfig } from "../lib/shippingDetailConfig";

export function ShippingContainer() {
  const [shippings] = useState<ShippingData[]>(initialShippingData as ShippingData[]);
  const config = createShippingDetailConfig();

  return (
    <DocumentDetailViewContainer
      data={shippings}
      config={config}
    />
  );
}